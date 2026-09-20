package com.sharepresent.domain.order.controller;

import com.sharepresent.domain.order.dto.AcceptGiftRequest;
import com.sharepresent.domain.order.dto.OrderResponse;
import com.sharepresent.domain.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend dev server CORS
@Tag(name = "Order & Settle API", description = "주문 결제 및 선물 수락 정산 API")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/pre-pay")
    @Operation(summary = "가결제 등록", description = "보내는 사람이 최대 한도 예산으로 결제를 성공했을 때 결제 키와 함께 주문을 가결제 상태(PAID)로 기록합니다.")
    public ResponseEntity<OrderResponse> prePayOrder(
            @RequestParam("curationBoxId") Long curationBoxId,
            @RequestParam("paymentKey") String paymentKey) {
        OrderResponse response = orderService.createPrePaidOrder(curationBoxId, paymentKey);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/accept/{sharingToken}")
    @Operation(summary = "선물 수락 및 최종 정산", description = "받는 사람이 상품(및 옵션)을 고르고 배송지를 입력하면 최종 정산 금액 계산 및 차액 환불 처리를 수행합니다.")
    public ResponseEntity<OrderResponse> acceptAndSettleGift(
            @PathVariable("sharingToken") String sharingToken,
            @Valid @RequestBody AcceptGiftRequest request) {
        OrderResponse response = orderService.acceptAndSettleGift(sharingToken, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/result/{sharingToken}")
    @Operation(summary = "정산 결과 및 주소지 조회", description = "보내는 사람이 결과 확인용 토큰을 통해 받는 이가 고른 상품과 배송지 주소를 확인합니다.")
    public ResponseEntity<OrderResponse> getOrderResult(@PathVariable("sharingToken") String sharingToken) {
        OrderResponse response = orderService.getOrderResult(sharingToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel/{sharingToken}")
    @Operation(summary = "선물 상자 취소 및 전액 환불", description = "수령인이 수락하기 전 보내는 사람이 선물 상자를 취소하고 가승인된 금액을 전액 즉시 환불 처리합니다.")
    public ResponseEntity<OrderResponse> cancelGiftBox(@PathVariable("sharingToken") String sharingToken) {
        OrderResponse response = orderService.cancelAndRefundGiftBox(sharingToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resend-notification/{sharingToken}")
    @Operation(summary = "선물 알림톡/문자 재발송", description = "발신자가 대시보드에서 수령인에게 선물 도착 안내 알림톡을 다시 발송합니다.")
    public ResponseEntity<OrderResponse> resendGiftNotification(@PathVariable("sharingToken") String sharingToken) {
        OrderResponse response = orderService.resendGiftNotification(sharingToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/extend-expiry/{sharingToken}")
    @Operation(summary = "선물 수락 기한 연장", description = "발신자가 대시보드에서 선물 수락 유효 기한을 +7일 연장합니다.")
    public ResponseEntity<OrderResponse> extendGiftExpiry(@PathVariable("sharingToken") String sharingToken) {
        OrderResponse response = orderService.extendGiftExpiry(sharingToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/thank-you/{sharingToken}")
    @Operation(summary = "수령인 감사 카드 및 포토 등록", description = "수령인이 선물 수락 후 발신자에게 전달할 감사 메시지, 스티커 및 언박싱 포토를 등록합니다.")
    public ResponseEntity<OrderResponse> submitThankYouReply(
            @PathVariable("sharingToken") String sharingToken,
            @Valid @RequestBody com.sharepresent.domain.order.dto.ThankYouReplyRequest request) {
        OrderResponse response = orderService.submitThankYouReply(sharingToken, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/modify-address/{sharingToken}")
    @Operation(summary = "수령인 배송지 및 희망 배송일 변경", description = "상품 출고 전 수령인이 입력했던 배송 주소지, 수령인 연락처 또는 희망 배송일을 수정합니다.")
    public ResponseEntity<OrderResponse> modifyRecipientAddress(
            @PathVariable("sharingToken") String sharingToken,
            @Valid @RequestBody com.sharepresent.domain.order.dto.ModifyAddressRequest request) {
        OrderResponse response = orderService.modifyRecipientAddress(sharingToken, request);
        return ResponseEntity.ok(response);
    }
}
