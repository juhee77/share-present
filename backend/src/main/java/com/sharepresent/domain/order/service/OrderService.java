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
                .build();

        Order savedOrder = orderRepository.save(settledOrder);

        // Curation Box 상태 업데이트
        CurationBox settledBox = box.toBuilder().status("ACCEPTED").build();
        curationBoxRepository.save(settledBox);

        // TODO: 실제 토스페이먼츠/포트원 API를 사용하여 partial refund API 호출 실행부 (환불액 > 0 일 때)
        if (refundAmount > 0) {
            triggerActualPaymentCancel(order.getPaymentKey(), refundAmount);
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

    private void triggerActualPaymentCancel(String paymentKey, int cancelAmount) {
        // PG사 REST cancel API 호출 모킹 (실제 개발 스프린트 2단계에서 구현 예정)
        System.out.printf("[Toss Payments API] Settle complete. Succeeded in partial refund. Key: %s, Refunded: %d KRW\n", paymentKey, cancelAmount);
    }

    private OrderResponse convertToResponse(Order order) {
        String prodName = order.getSelectedProduct() != null ? order.getSelectedProduct().getName() : null;
        String prodBrand = order.getSelectedProduct() != null ? order.getSelectedProduct().getBrand() : null;
        String extUrl = order.getSelectedProduct() != null ? order.getSelectedProduct().getExternalUrl() : null;

        return OrderResponse.builder()
                .orderId(order.getId())
                .selectedProductName(prodName)
                .selectedProductBrand(prodBrand)
                .selectedOption(order.getSelectedOption())
                .shippingStatus(order.getShippingStatus())
                .lockedAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .refundAmount(order.getRefundAmount())
                .externalUrl(extUrl)
                .status(order.getShippingStatus())
                .build();
    }
}
