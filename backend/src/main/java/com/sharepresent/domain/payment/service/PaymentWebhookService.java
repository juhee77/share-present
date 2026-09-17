package com.sharepresent.domain.payment.service;

import com.sharepresent.domain.order.entity.Order;
import com.sharepresent.domain.order.repository.OrderRepository;
import com.sharepresent.domain.payment.dto.PaymentWebhookRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookService {

    private final OrderRepository orderRepository;

    @Value("${payment.webhook.secret:sharepresent-webhook-secret-key-default}")
    private String webhookSecret;

    /**
     * PG사 웹훅 요청의 HMAC-SHA256 서명을 검증하고 주문 결제 상태를 반영합니다.
     */
    @Transactional
    public boolean processWebhook(PaymentWebhookRequest request) {
        // 1. 서명 검증 (헤더/본문 서명이 주어진 경우)
        if (request.getSignature() != null && !request.getSignature().isBlank()) {
            boolean isValidSignature = verifySignature(request.getPaymentKey() + ":" + request.getAmount(), request.getSignature());
            if (!isValidSignature) {
                log.warn("[PaymentWebhook] Invalid webhook signature detected for paymentKey: {}", request.getPaymentKey());
                throw new IllegalArgumentException("유효하지 않은 웹훅 서명입니다.");
            }
        }

        // 2. 주문 엔티티 조회
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문 정보를 찾을 수 없습니다. ID: " + request.getOrderId()));

        // 3. 이벤트 타입별 상태 전이
        switch (request.getEventType()) {
            case "PAYMENT_AUTHORIZED" -> {
                Order updated = order.toBuilder()
                        .shippingStatus("PAID")
                        .paymentKey(request.getPaymentKey())
                        .build();
                orderRepository.save(updated);
                log.info("[PaymentWebhook] Order #{} state transitioned to PAID (Authorized amount: {} KRW)", order.getId(), request.getAmount());
            }
            case "PAYMENT_CAPTURED" -> {
                Order updated = order.toBuilder()
                        .shippingStatus("COMPLETED")
                        .build();
                orderRepository.save(updated);
                log.info("[PaymentWebhook] Order #{} state transitioned to COMPLETED (Captured amount: {} KRW)", order.getId(), request.getAmount());
            }
            case "PAYMENT_CANCELLED" -> {
                Order updated = order.toBuilder()
                        .shippingStatus("CANCELLED")
                        .refundAmount(request.getAmount())
                        .build();
                orderRepository.save(updated);
                log.info("[PaymentWebhook] Order #{} cancelled and refunded (Refunded amount: {} KRW)", order.getId(), request.getAmount());
            }
            default -> log.info("[PaymentWebhook] Ignored unhandled event type: {}", request.getEventType());
        }

        return true;
    }

    public boolean verifySignature(String payload, String receivedSignature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedHex = HexFormat.of().formatHex(rawHmac);
            return MessageDigest.isEqual(computedHex.getBytes(StandardCharsets.UTF_8), receivedSignature.toLowerCase().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("[PaymentWebhook] Signature verification error", e);
            return false;
        }
    }
}
