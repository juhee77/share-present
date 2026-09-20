package com.sharepresent.domain.curation.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sharepresent.domain.curation.dto.CreateCurationBoxRequest;
import com.sharepresent.domain.curation.dto.CurationBoxResponse;
import com.sharepresent.domain.curation.service.CurationBoxService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CurationBoxController.class)
class CurationBoxControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CurationBoxService curationBoxService;

    @Test
    @DisplayName("POST /api/v1/curation-boxes - 선물 상자 생성 API 성공")
    void createCurationBox_success() throws Exception {
        // given
        CreateCurationBoxRequest request = CreateCurationBoxRequest.builder()
                .senderId(1L)
                .minBudget(30000)
                .maxBudget(60000)
                .messageCard("생일 축하해!")
                .productIds(List.of(1L, 2L))
                .build();

        CurationBoxResponse mockResponse = CurationBoxResponse.builder()
                .id(100L)
                .senderName("주희")
                .minBudget(30000)
                .maxBudget(60000)
                .messageCard("생일 축하해!")
                .sharingToken("test-share-token")
                .build();

        given(curationBoxService.createCurationBox(any(CreateCurationBoxRequest.class))).willReturn(mockResponse);

        // when & then
        mockMvc.perform(post("/api/v1/curation-boxes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100))
                .andExpect(jsonPath("$.senderName").value("주희"))
                .andExpect(jsonPath("$.minBudget").value(30000))
                .andExpect(jsonPath("$.maxBudget").value(60000))
                .andExpect(jsonPath("$.sharingToken").value("test-share-token"));
    }

    @Test
    @DisplayName("POST /api/v1/curation-boxes - 필수 파라미터 누락 시 400 Bad Request 검증")
    void createCurationBox_validationFailure() throws Exception {
        // given: minBudget과 maxBudget이 누락된 잘못된 요청
        CreateCurationBoxRequest invalidRequest = CreateCurationBoxRequest.builder()
                .senderId(1L)
                .messageCard("누락 테스트")
                .build();

        // when & then
        mockMvc.perform(post("/api/v1/curation-boxes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/v1/curation-boxes/{token} - 수령인 선물 상자 조회 성공")
    void getCurationBox_success() throws Exception {
        // given
        CurationBoxResponse mockResponse = CurationBoxResponse.builder()
                .id(100L)
                .senderName("주희")
                .minBudget(30000)
                .maxBudget(60000)
                .messageCard("특별한 날을 축하해!")
                .sharingToken("valid-token")
                .build();

        given(curationBoxService.getCurationBoxByToken("valid-token")).willReturn(mockResponse);

        // when & then
        mockMvc.perform(get("/api/v1/curation-boxes/valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sharingToken").value("valid-token"))
                .andExpect(jsonPath("$.senderName").value("주희"))
                .andExpect(jsonPath("$.messageCard").value("특별한 날을 축하해!"));
    }

    @Test
    @DisplayName("POST /api/v1/curation-boxes/verify-pin/{token} - 수령인 PIN 번호 검증 성공")
    void verifyPin_success() throws Exception {
        // given
        com.sharepresent.domain.curation.dto.VerifyPinRequest request =
                com.sharepresent.domain.curation.dto.VerifyPinRequest.builder()
                        .pin("1234")
                        .build();

        given(curationBoxService.verifyClaimPin("valid-token", "1234")).willReturn(true);

        // when & then
        mockMvc.perform(post("/api/v1/curation-boxes/verify-pin/valid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.message").value("PIN 번호가 일치합니다."));
    }
}
