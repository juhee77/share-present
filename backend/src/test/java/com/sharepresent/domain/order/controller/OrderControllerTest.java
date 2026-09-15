package com.sharepresent.domain.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharepresent.domain.order.dto.AcceptGiftRequest;
import com.sharepresent.domain.order.dto.OrderResponse;
import com.sharepresent.domain.order.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    @DisplayName("POST /api/v1/orders/pre-pay - 에스크로 가결제 주문 생성 API 성공")
    void prePayOrder_success() throws Exception {
        // given
        OrderResponse mockResponse = OrderResponse.builder()
                .orderId(1L)
                .lockedAmount(60000)
                .shippingStatus("PAID")
                .build();

        given(orderService.createPrePaidOrder(eq(100L), eq("test_payment_key"))).willReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/api/v1/orders/pre-pay")
                        .param("curationBoxId", "100")
                        .param("paymentKey", "test_payment_key"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1))
                .andExpect(jsonPath("$.lockedAmount").value(60000))
                .andExpect(jsonPath("$.shippingStatus").value("PAID"));
    }

    @Test
    @DisplayName("POST /api/v1/orders/accept/{sharingToken} - 수령인 선물 수락 및 최종 정산 API 성공")
    void acceptAndSettleGift_success() throws Exception {
        // given
        AcceptGiftRequest request = AcceptGiftRequest.builder()
                .receiverName("김수령")
                .receiverPhone("010-1234-5678")
                .shippingAddress("서울특별시 강남구 테헤란로 152")
                .selectedProductId(10L)
                .selectedOption("샌드 화이트")
                .build();

        OrderResponse mockResponse = OrderResponse.builder()
                .orderId(1L)
                .selectedProductName("소락사 샌디 도자기 머그")
                .selectedProductBrand("OIMU")
                .selectedOption("샌드 화이트")
                .lockedAmount(60000)
                .finalAmount(38000)
                .refundAmount(22000)
                .shippingStatus("COMPLETED")
                .build();

        given(orderService.acceptAndSettleGift(eq("sample-token"), any(AcceptGiftRequest.class))).willReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/api/v1/orders/accept/sample-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.selectedProductName").value("소락사 샌디 도자기 머그"))
                .andExpect(jsonPath("$.finalAmount").value(38000))
                .andExpect(jsonPath("$.refundAmount").value(22000))
                .andExpect(jsonPath("$.shippingStatus").value("COMPLETED"));
    }

    @Test
    @DisplayName("GET /api/v1/orders/result/{sharingToken} - 정산 결과 조회 API 성공")
    void getOrderResult_success() throws Exception {
        // given
        OrderResponse mockResponse = OrderResponse.builder()
                .orderId(1L)
                .selectedProductName("소락사 샌디 도자기 머그")
                .selectedProductBrand("OIMU")
                .lockedAmount(60000)
                .finalAmount(38000)
                .refundAmount(22000)
                .shippingStatus("COMPLETED")
                .build();

        given(orderService.getOrderResult("sample-token")).willReturn(mockResponse);

        // when & then
        mockMvc.perform(get("/api/v1/orders/result/sample-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.selectedProductName").value("소락사 샌디 도자기 머그"))
                .andExpect(jsonPath("$.refundAmount").value(22000));
    }
}
