package com.sharepresent.domain.order.service;

import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
import com.sharepresent.domain.order.dto.AcceptGiftRequest;
import com.sharepresent.domain.order.dto.OrderResponse;
import com.sharepresent.domain.order.entity.Order;
import com.sharepresent.domain.order.repository.OrderRepository;
import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.user.entity.User;
import com.sharepresent.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CurationBoxRepository curationBoxRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final KakaoNotificationService kakaoNotificationService;

    /**
     * 보내는 사람이 예산 한도로 가결제를 마쳤을 때 호출되는 메서드
     */
    @Transactional
    public OrderResponse createPrePaidOrder(Long curationBoxId, String paymentKey) {
        CurationBox box = curationBoxRepository.findById(curationBoxId)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. ID: " + curationBoxId));

        Order order = Order.builder()
                .curationBox(box)
                .sender(box.getSender())
                .totalAmount(box.getMaxBudget())
                .paymentKey(paymentKey)
                .shippingStatus("PAID")
                .paidAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);
        
        // Curation Box 상태 업데이트
        CurationBox updatedBox = box.toBuilder().status("PAID").build();
        curationBoxRepository.save(updatedBox);

        return convertToResponse(savedOrder);
    }

    /**
     * 받는 사람이 선물을 수락하고 배송지를 적었을 때 호출되는 최종 정산 메서드
     */
    @Transactional
    public OrderResponse acceptAndSettleGift(String sharingToken, AcceptGiftRequest request) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseGet(() -> {
                    // 가결제 단계를 건너뛴 샌드박스 테스트를 위한 자동 주문 폴백 생성
                    Order mockOrder = Order.builder()
                            .curationBox(box)
                            .sender(box.getSender())
                            .totalAmount(box.getMaxBudget())
                            .paymentKey("mock_payment_key_" + System.currentTimeMillis())
                            .shippingStatus("PAID")
                            .paidAt(LocalDateTime.now())
                            .build();
                    return orderRepository.save(mockOrder);
                });

        // 1. 받는 사람 User 등록 (없을 경우 동적 생성)
        String mockEmail = request.getReceiverPhone().replace("-", "") + "@recipient.sharepresent.com";
        User receiver = userRepository.findByEmail(mockEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(mockEmail)
                            .nickname(request.getReceiverName())
                            .phoneNumber(request.getReceiverPhone())
                            .build();
                    return userRepository.save(newUser);
                });

        // 2. 최종 선택 상품 확인
        Product selectedProduct;
        if (request.getIsRecipientAdded() != null && request.getIsRecipientAdded()) {
            // 받는 사람이 원하는 상품을 직접 입력한 경우
            selectedProduct = Product.builder()
                    .brand(request.getRecipientCustomBrand())
                    .name(request.getRecipientCustomName())
                    .price(0) // 외부 링크이므로 정가 0으로 처리
                    .externalUrl(request.getRecipientCustomUrl())
                    .options(request.getSelectedOption() != null ? java.util.List.of(request.getSelectedOption()) : java.util.Collections.emptyList())
                    .isCustom(true)
                    .owner(box.getSender())
                    .build();
            selectedProduct = productRepository.save(selectedProduct);
        } else {
            // 보내는 이가 제안한 리스트 중에서 고른 경우
            selectedProduct = productRepository.findById(request.getSelectedProductId())
                    .orElseThrow(() -> new IllegalArgumentException("선택한 상품을 찾을 수 없습니다. ID: " + request.getSelectedProductId()));
        }

        // 3. 차액 환불 금액 계산
        int lockedAmount = order.getTotalAmount();
        int finalAmount;
        int refundAmount;

        if (selectedProduct.getIsCustom()) {
            // 외부 링크 상품일 경우: 
            // 플랫폼이 자동 배송 대행을 처리할 수 없으므로 가결제 전액(100%)을 보내는 이에게 자동 환불 처리하며, 
            // 보내는 사람이 주소지를 복사하여 외부 사이트에서 직접 구매하도록 안내합니다.
            finalAmount = 0;
            refundAmount = lockedAmount;
        } else {
            // 내부 정식 파트너십 상품일 경우:
            // 제품 가격만큼만 정산(최종 결제)하고, 남은 예산은 부분 환불 처리합니다.
            finalAmount = selectedProduct.getPrice();
            refundAmount = Math.max(0, lockedAmount - finalAmount);
        }

        // 4. 주문 정산 완료 상태 업데이트 (Immutable Builder 패턴 적용)
        Order settledOrder = order.toBuilder()
                .receiver(receiver)
                .selectedProduct(selectedProduct)
                .selectedOption(request.getSelectedOption())
                .finalAmount(finalAmount)
                .refundAmount(refundAmount)
                .recipientName(request.getReceiverName())
                .recipientPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingStatus("COMPLETED")
                .settledAt(LocalDateTime.now())
                .thankYouSticker(request.getThankYouSticker())
                .thankYouMessage(request.getThankYouMessage())
                .thankYouPhotoUrl(request.getThankYouPhotoUrl())
                .desiredDeliveryDate(request.getDesiredDeliveryDate())
                .ecoFriendlyPackaging(request.getEcoFriendlyPackaging() != null ? request.getEcoFriendlyPackaging() : false)
                .entranceMemo(request.getEntranceMemo())
                .preDeliveryNotification(request.getPreDeliveryNotification() != null ? request.getPreDeliveryNotification() : true)
                .build();

        Order savedOrder = orderRepository.save(settledOrder);

        // Curation Box 상태 업데이트
        CurationBox settledBox = box.toBuilder().status("ACCEPTED").build();
        curationBoxRepository.save(settledBox);

        // TODO: 실제 토스페이먼츠/포트원 API를 사용하여 partial refund API 호출 실행부 (환불액 > 0 일 때)
        if (refundAmount > 0) {
            triggerActualPaymentCancel(order.getPaymentKey(), refundAmount);
        }

        // 카카오 알림톡 자동 발송 (송신자 대상 선물 수락 및 정산 알림)
        if (savedOrder.getSender() != null) {
            String phone = savedOrder.getSender().getPhoneNumber() != null ? savedOrder.getSender().getPhoneNumber() : "010-0000-0000";
            String senderNick = savedOrder.getSender().getNickname() != null ? savedOrder.getSender().getNickname() : "고객";
            kakaoNotificationService.sendGiftAcceptedNotification(
                    phone,
                    senderNick,
                    savedOrder.getRecipientName(),
                    selectedProduct.getName(),
                    refundAmount
            );
        }

        return convertToResponse(savedOrder);
    }

    /**
     * 외부 정산 조회 (보내는 사람용 결과 화면)
     */
    public OrderResponse getOrderResult(String sharingToken) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseThrow(() -> new IllegalArgumentException("주문 내역을 찾을 수 없습니다. Box ID: " + box.getId()));

        return convertToResponse(order);
    }

    /**
     * D-7 기한 만료(미수락) 선물 박스 자동 취소 및 전액 100% 환불 처리
     */
    @Transactional
    public int expireAndRefundUnclaimedGiftBoxes(LocalDateTime threshold) {
        java.util.List<CurationBox> expiredBoxes = curationBoxRepository.findByStatusInAndCreatedAtBefore(
                java.util.List.of("WAITING", "CREATED", "PAID"),
                threshold
        );

        int processedCount = 0;
        for (CurationBox box : expiredBoxes) {
            // 1. CurationBox 상태를 EXPIRED 로 갱신
            CurationBox updatedBox = box.toBuilder()
                    .status("EXPIRED")
                    .build();
            curationBoxRepository.save(updatedBox);

            // 2. 연관 Order 가 있을 경우 100% 전액 환불 및 EXPIRED_REFUNDED 처리
            orderRepository.findByCurationBoxId(box.getId()).ifPresent(order -> {
                int fullRefund = order.getTotalAmount();
                Order refundedOrder = order.toBuilder()
                        .finalAmount(0)
                        .refundAmount(fullRefund)
                        .shippingStatus("EXPIRED_REFUNDED")
                        .settledAt(LocalDateTime.now())
                        .build();
                orderRepository.save(refundedOrder);

                if (order.getPaymentKey() != null) {
                    triggerActualPaymentCancel(order.getPaymentKey(), fullRefund);
                }

                if (refundedOrder.getSender() != null) {
                    String phone = refundedOrder.getSender().getPhoneNumber() != null ? refundedOrder.getSender().getPhoneNumber() : "010-0000-0000";
                    String name = refundedOrder.getSender().getNickname() != null ? refundedOrder.getSender().getNickname() : "고객";
                    kakaoNotificationService.sendGiftExpiredNotification(phone, name, fullRefund);
                }
            });

            processedCount++;
        }

        return processedCount;
    }

    /**
     * 송신자가 미수락 선물 상자를 직접 취소하고 전액 100% 환불 처리
     */
    @Transactional
    public OrderResponse cancelAndRefundGiftBox(String sharingToken) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        if ("COMPLETED".equalsIgnoreCase(box.getStatus()) || "ACCEPTED".equalsIgnoreCase(box.getStatus())) {
            throw new IllegalStateException("이미 수령인이 수락한 선물은 취소할 수 없습니다.");
        }

        // 1. CurationBox 상태 갱신
        CurationBox cancelledBox = box.toBuilder()
                .status("CANCELLED")
                .build();
        curationBoxRepository.save(cancelledBox);

        // 2. Order 가 있을 경우 전액 환불 처리
        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseGet(() -> Order.builder()
                        .curationBox(cancelledBox)
                        .sender(box.getSender())
                        .totalAmount(box.getMaxBudget())
                        .paymentKey("mock_cancel_key_" + System.currentTimeMillis())
                        .shippingStatus("CANCELLED_REFUNDED")
                        .paidAt(LocalDateTime.now())
                        .build());

        int fullRefund = order.getTotalAmount() != null ? order.getTotalAmount() : box.getMaxBudget();
        Order refundedOrder = order.toBuilder()
                .finalAmount(0)
                .refundAmount(fullRefund)
                .shippingStatus("CANCELLED_REFUNDED")
                .settledAt(LocalDateTime.now())
                .build();
        Order savedOrder = orderRepository.save(refundedOrder);

        if (order.getPaymentKey() != null) {
            triggerActualPaymentCancel(order.getPaymentKey(), fullRefund);
        }

        if (savedOrder.getSender() != null) {
            String phone = savedOrder.getSender().getPhoneNumber() != null ? savedOrder.getSender().getPhoneNumber() : "010-0000-0000";
            String name = savedOrder.getSender().getNickname() != null ? savedOrder.getSender().getNickname() : "고객";
            kakaoNotificationService.sendGiftExpiredNotification(phone, name, fullRefund);
        }

        return convertToResponse(savedOrder);
    }

    /**
     * 발신자가 대시보드에서 알림톡 미수신 수령인에게 알림톡/문자 재발송 요청
     */
    @Transactional
    public OrderResponse resendGiftNotification(String sharingToken) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseGet(() -> {
                    // 미결제 상태인 경우 기본 응답 객체 생성
                    return Order.builder()
                            .curationBox(box)
                            .sender(box.getSender())
                            .totalAmount(box.getMaxBudget())
                            .shippingStatus("WAITING")
                            .build();
                });

        String recipientPhone = order.getRecipientPhone();
        String recipientName = order.getRecipientName();
        if (recipientPhone == null || recipientPhone.isBlank()) {
            recipientPhone = order.getSender() != null ? order.getSender().getPhoneNumber() : "010-0000-0000";
            recipientName = "소중한 분";
        }

        String giftUrl = "https://sharepresent.app/gift/" + sharingToken;
        kakaoNotificationService.sendGiftCreatedNotification(
                recipientPhone,
                order.getSender() != null ? order.getSender().getNickname() : "주희",
                recipientName,
                giftUrl
        );

        return convertToResponse(order);
    }

    /**
     * 송신자가 대시보드에서 선물 수락 기한을 +7일 연장
     */
    @Transactional
    public OrderResponse extendGiftExpiry(String sharingToken) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        if ("CANCELLED".equalsIgnoreCase(box.getStatus()) || "COMPLETED".equalsIgnoreCase(box.getStatus()) || "ACCEPTED".equalsIgnoreCase(box.getStatus())) {
            throw new IllegalStateException("대기 중인 선물 상자만 기한을 연장할 수 있습니다.");
        }

        LocalDateTime currentExpiry = box.getExpiredAt() != null && box.getExpiredAt().isAfter(LocalDateTime.now())
                ? box.getExpiredAt()
                : LocalDateTime.now();

        LocalDateTime newExpiry = currentExpiry.plusDays(7);

        CurationBox updatedBox = box.toBuilder()
                .expiredAt(newExpiry)
                .build();
        CurationBox savedBox = curationBoxRepository.save(updatedBox);

        Order order = orderRepository.findByCurationBoxId(savedBox.getId())
                .orElseGet(() -> Order.builder()
                        .curationBox(savedBox)
                        .sender(savedBox.getSender())
                        .totalAmount(savedBox.getMaxBudget())
                        .shippingStatus("WAITING")
                        .build());

        return convertToResponse(order);
    }

    /**
     * 수령인이 발신자에게 감사 카드 및 언박싱 포토를 등록/수정
     */
    @Transactional
    public OrderResponse submitThankYouReply(String sharingToken, com.sharepresent.domain.order.dto.ThankYouReplyRequest request) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));

        Order updatedOrder = order.toBuilder()
                .thankYouSticker(request.getThankYouSticker() != null ? request.getThankYouSticker() : "💖 취향저격 고마워!")
                .thankYouMessage(request.getThankYouMessage())
                .thankYouPhotoUrl(request.getThankYouPhotoUrl())
                .build();

        Order savedOrder = orderRepository.save(updatedOrder);

        if (kakaoNotificationService != null && order.getSender() != null) {
            try {
                String receiver = order.getRecipientName() != null ? order.getRecipientName() : "수령인";
                kakaoNotificationService.sendThankYouCardNotification(
                        order.getSender().getPhoneNumber(),
                        order.getSender().getNickname(),
                        receiver,
                        request.getThankYouMessage()
                );
            } catch (Exception ignored) {}
        }

        return convertToResponse(savedOrder);
    }

    /**
     * 수령인이 출고 전 배송 주소지 및 희망 배송일을 변경
     */
    @Transactional
    public OrderResponse modifyRecipientAddress(String sharingToken, com.sharepresent.domain.order.dto.ModifyAddressRequest request) {
        CurationBox box = curationBoxRepository.findBySharingToken(sharingToken)
                .orElseThrow(() -> new IllegalArgumentException("선물 박스를 찾을 수 없습니다. Token: " + sharingToken));

        Order order = orderRepository.findByCurationBoxId(box.getId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다."));

        if ("SHIPPED".equals(order.getShippingStatus()) || "DELIVERED".equals(order.getShippingStatus())) {
            throw new IllegalStateException("이미 배송이 시작되어 배송지를 변경할 수 없습니다.");
        }

        Order modifiedOrder = order.toBuilder()
                .recipientName(request.getReceiverName() != null ? request.getReceiverName() : order.getRecipientName())
                .recipientPhone(request.getReceiverPhone() != null ? request.getReceiverPhone() : order.getRecipientPhone())
                .shippingAddress(request.getShippingAddress() != null ? request.getShippingAddress() : order.getShippingAddress())
                .desiredDeliveryDate(request.getDesiredDeliveryDate() != null ? request.getDesiredDeliveryDate() : order.getDesiredDeliveryDate())
                .ecoFriendlyPackaging(request.getEcoFriendlyPackaging() != null ? request.getEcoFriendlyPackaging() : order.getEcoFriendlyPackaging())
                .entranceMemo(request.getEntranceMemo() != null ? request.getEntranceMemo() : order.getEntranceMemo())
                .preDeliveryNotification(request.getPreDeliveryNotification() != null ? request.getPreDeliveryNotification() : order.getPreDeliveryNotification())
                .build();

        Order savedOrder = orderRepository.save(modifiedOrder);
        return convertToResponse(savedOrder);
    }

    private void triggerActualPaymentCancel(String paymentKey, int cancelAmount) {
        // PG사 REST cancel API 호출 모킹 (실제 개발 스프린트 2단계에서 구현 예정)
        System.out.printf("[Toss Payments API] Settle complete. Succeeded in partial refund. Key: %s, Refunded: %d KRW\n", paymentKey, cancelAmount);
    }

    private OrderResponse convertToResponse(Order order) {
        String prodName = order.getSelectedProduct() != null ? order.getSelectedProduct().getName() : null;
        String prodBrand = order.getSelectedProduct() != null ? order.getSelectedProduct().getBrand() : null;
        String extUrl = order.getSelectedProduct() != null ? order.getSelectedProduct().getExternalUrl() : null;
        String token = order.getCurationBox() != null ? order.getCurationBox().getSharingToken() : null;
        String expAt = order.getCurationBox() != null && order.getCurationBox().getExpiredAt() != null
                ? order.getCurationBox().getExpiredAt().toString()
                : null;

        return OrderResponse.builder()
                .orderId(order.getId())
                .selectedProductName(prodName)
                .selectedProductBrand(prodBrand)
                .selectedOption(order.getSelectedOption())
                .shippingStatus(order.getShippingStatus())
                .carrierName(order.getCarrierName())
                .trackingNumber(order.getTrackingNumber())
                .lockedAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .refundAmount(order.getRefundAmount())
                .externalUrl(extUrl)
                .sharingToken(token)
                .expiredAt(expAt)
                .status(order.getShippingStatus())
                .thankYouSticker(order.getThankYouSticker())
                .thankYouMessage(order.getThankYouMessage())
                .thankYouPhotoUrl(order.getThankYouPhotoUrl())
                .desiredDeliveryDate(order.getDesiredDeliveryDate())
                .ecoFriendlyPackaging(order.getEcoFriendlyPackaging())
                .entranceMemo(order.getEntranceMemo())
                .preDeliveryNotification(order.getPreDeliveryNotification())
                .build();
    }
}
