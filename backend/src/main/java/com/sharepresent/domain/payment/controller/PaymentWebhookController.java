package com.sharepresent.domain.payment.controller;

import com.sharepresent.domain.payment.dto.PaymentWebhookRequest;
import com.sharepresent.domain.payment.service.PaymentWebhookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Payment Webhook API", description = "토스페이먼츠 / 카카오페이 결제 상태 비동기 웹훅 수신 엔드포인트")
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final PaymentWebhookService paymentWebhookService;

    @Operation(summary = "PG사 결제 웹훅 수신 및 무결성 검증", description = "PG사에서 전송한 결제 승인/매입/취소 이벤트를 수신하여 주문 상태를 실시간 갱신합니다.")
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> handlePaymentWebhook(
            @Valid @RequestBody PaymentWebhookRequest request
    ) {
        boolean processed = paymentWebhookService.processWebhook(request);
        return ResponseEntity.ok(Map.of(
                "success", processed,
                "message", "Webhook processed successfully",
                "orderId", request.getOrderId(),
                "eventType", request.getEventType()
        ));
    }
}
