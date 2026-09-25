package com.sharepresent.domain.admin.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharepresent.domain.admin.dto.*;
import com.sharepresent.domain.admin.service.AdminService;
import com.sharepresent.domain.product.entity.Product;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AdminService adminService;

    @Test
    @DisplayName("GET /api/v1/admin/stats - 통계 조회 성공")
    void getStats_success() throws Exception {
        AdminStatsResponse stats = AdminStatsResponse.builder()
                .totalOrders(10)
                .totalGrossAmount(1000000)
                .totalSettledAmount(850000)
                .totalRefundAmount(150000)
                .preparingCount(2)
                .shippingCount(3)
                .deliveredCount(5)
                .acceptanceRate(80.0)
                .pendingInquiriesCount(1)
                .build();

        given(adminService.getDashboardStats()).willReturn(stats);

        mockMvc.perform(get("/api/v1/admin/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalOrders").value(10))
                .andExpect(jsonPath("$.totalGrossAmount").value(1000000))
                .andExpect(jsonPath("$.acceptanceRate").value(80.0));
    }

    @Test
    @DisplayName("GET /api/v1/admin/orders - 주문 목록 조회 성공")
    void getOrders_success() throws Exception {
        AdminOrderResponse order = AdminOrderResponse.builder()
                .id(1L)
                .recipientName("수령인")
                .shippingStatus("PREPARING")
                .totalAmount(100000)
                .build();

        given(adminService.getAllOrders(any(), any())).willReturn(List.of(order));

        mockMvc.perform(get("/api/v1/admin/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].recipientName").value("수령인"));
    }

    @Test
    @DisplayName("PATCH /api/v1/admin/orders/{orderId}/shipping - 배송 상태 업데이트 성공")
    void updateShipping_success() throws Exception {
        UpdateShippingRequest request = UpdateShippingRequest.builder()
                .shippingStatus("SHIPPING")
                .carrierName("CJ대한통운")
                .trackingNumber("1234-5678")
                .build();

        AdminOrderResponse updated = AdminOrderResponse.builder()
                .id(1L)
                .shippingStatus("SHIPPING")
                .carrierName("CJ대한통운")
                .trackingNumber("1234-5678")
                .build();

        given(adminService.updateShipping(eq(1L), any(UpdateShippingRequest.class))).willReturn(updated);

        mockMvc.perform(patch("/api/v1/admin/orders/1/shipping")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shippingStatus").value("SHIPPING"))
                .andExpect(jsonPath("$.trackingNumber").value("1234-5678"));
    }

    @Test
    @DisplayName("POST /api/v1/admin/products - 신규 상품 등록 성공")
    void createProduct_success() throws Exception {
        CreateProductRequest request = CreateProductRequest.builder()
                .brand("Tamburins")
                .name("퍼퓸 밤 카모")
                .price(46500)
                .category("FRAGRANCE")
                .description("카모마일의 진한 향")
                .stockQuantity(100)
                .build();

        Product created = Product.builder()
                .id(10L)
                .brand("Tamburins")
                .name("퍼퓸 밤 카모")
                .price(46500)
                .build();

        given(adminService.createProduct(any(CreateProductRequest.class))).willReturn(created);

        mockMvc.perform(post("/api/v1/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L))
                .andExpect(jsonPath("$.brand").value("Tamburins"));
    }

    @Test
    @DisplayName("POST /api/v1/admin/inquiries/{inquiryCode}/reply - 1:1 문의 답변 성공")
    void replyInquiry_success() throws Exception {
        ReplyInquiryRequest request = ReplyInquiryRequest.builder()
                .reply("확인 후 처리 완료되었습니다.")
                .build();

        AdminInquiryResponse response = AdminInquiryResponse.builder()
                .inquiryCode("INQ-123456")
                .status("ANSWERED")
                .adminReply("확인 후 처리 완료되었습니다.")
                .build();

        given(adminService.replyInquiry(eq("INQ-123456"), any(ReplyInquiryRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/v1/admin/inquiries/INQ-123456/reply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ANSWERED"))
                .andExpect(jsonPath("$.adminReply").value("확인 후 처리 완료되었습니다."));
    }
}
