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
}
