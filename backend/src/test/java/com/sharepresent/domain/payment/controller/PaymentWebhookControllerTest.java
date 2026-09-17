package com.sharepresent.domain.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharepresent.domain.payment.dto.PaymentWebhookRequest;
import com.sharepresent.domain.payment.service.PaymentWebhookService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentWebhookController.class)
class PaymentWebhookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentWebhookService paymentWebhookService;

    @Test
    @DisplayName("결제 승인 웹훅 수신 시 200 OK 및 정상 처리 응답을 반환한다")
    void handlePaymentWebhook_authorizedEvent_returns200() throws Exception {
        // given
        PaymentWebhookRequest request = PaymentWebhookRequest.builder()
                .eventType("PAYMENT_AUTHORIZED")
                .paymentKey("toss_pay_key_12345")
                .orderId(100L)
                .amount(60000)
                .status("DONE")
                .build();

        given(paymentWebhookService.processWebhook(any(PaymentWebhookRequest.class))).willReturn(true);

        // when & then
        mockMvc.perform(post("/api/v1/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.orderId").value(100))
                .andExpect(jsonPath("$.eventType").value("PAYMENT_AUTHORIZED"));
    }

    @Test
    @DisplayName("결제 키 누락 시 400 Bad Request를 반환한다")
    void handlePaymentWebhook_missingPaymentKey_returns400() throws Exception {
        // given
        PaymentWebhookRequest invalidRequest = PaymentWebhookRequest.builder()
                .eventType("PAYMENT_AUTHORIZED")
                .orderId(100L)
                .amount(60000)
                .build();

        // when & then
        mockMvc.perform(post("/api/v1/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
