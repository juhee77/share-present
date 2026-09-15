package com.sharepresent.domain.support.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SupportInquiryController.class)
class SupportInquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/support/inquiries - 1:1 고객 지원 문의 접수 성공")
    void submitInquiry_success() throws Exception {
        // given
        SupportInquiryController.InquiryRequest request = SupportInquiryController.InquiryRequest.builder()
                .name("홍길동")
                .email("gildong@example.com")
                .category("배송/운송장 문의")
                .content("운송장 조회가 언제부터 가능한가요?")
                .build();

        // when & then
        mockMvc.perform(post("/api/v1/support/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.message").value("고객님의 문의가 정상적으로 접수되었습니다. 담당자 확인 후 빠르게 답변 드리겠습니다."));
    }
}
