package com.sharepresent.domain.curation.service;

import com.sharepresent.domain.curation.dto.AiMessageResponse;
import com.sharepresent.domain.curation.dto.GenerateAiMessageRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AiMessageAssistantServiceTest {

    private AiMessageAssistantService aiMessageAssistantService;

    @BeforeEach
    void setUp() {
        aiMessageAssistantService = new AiMessageAssistantService();
    }

    @Test
    @DisplayName("생일(BIRTHDAY) WARM 톤 문구 생성 검증")
    void generateBirthdayWarmMessage() {
        GenerateAiMessageRequest request = GenerateAiMessageRequest.builder()
                .situation("BIRTHDAY")
                .tone("WARM")
                .receiverName("지우")
                .senderName("민우")
                .build();

        AiMessageResponse response = aiMessageAssistantService.generateMessage(request);

        assertThat(response).isNotNull();
        assertThat(response.getSituation()).isEqualTo("BIRTHDAY");
        assertThat(response.getTone()).isEqualTo("WARM");
        assertThat(response.getGeneratedMessage()).contains("지우님, 생일을 진심으로 축하해요!");
        assertThat(response.getRecommendedTheme()).isEqualTo("rose");
        assertThat(response.getRecommendedMonogram()).isEqualTo("HBD");
        assertThat(response.getAlternativeSnippets()).isNotEmpty();
    }

    @Test
    @DisplayName("집들이(HOUSEWARMING) EDITORIAL 톤 문구 생성 검증")
    void generateHousewarmingEditorialMessage() {
        GenerateAiMessageRequest request = GenerateAiMessageRequest.builder()
                .situation("HOUSEWARMING")
                .tone("EDITORIAL")
                .receiverName("민지")
                .build();

        AiMessageResponse response = aiMessageAssistantService.generateMessage(request);

        assertThat(response).isNotNull();
        assertThat(response.getSituation()).isEqualTo("HOUSEWARMING");
        assertThat(response.getGeneratedMessage()).contains("New Home, New Inspiration.");
        assertThat(response.getRecommendedTheme()).isEqualTo("emerald");
        assertThat(response.getRecommendedMonogram()).isEqualTo("CONG");
    }

    @Test
    @DisplayName("기본값(상황/톤 미지정) 감사 문구 생성 검증")
    void generateDefaultThankYouMessage() {
        GenerateAiMessageRequest request = GenerateAiMessageRequest.builder().build();

        AiMessageResponse response = aiMessageAssistantService.generateMessage(request);

        assertThat(response).isNotNull();
        assertThat(response.getSituation()).isEqualTo("THANK_YOU");
        assertThat(response.getTone()).isEqualTo("EDITORIAL");
        assertThat(response.getRecommendedTheme()).isEqualTo("ivory");
        assertThat(response.getRecommendedMonogram()).isEqualTo("THX");
    }
}
