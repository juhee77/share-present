package com.sharepresent.domain.order.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class KakaoNotificationServiceTest {

    private final KakaoNotificationService kakaoNotificationService = new KakaoNotificationService();

    @Test
    @DisplayName("선물 수락 알림톡 발송 성공")
    void sendGiftAcceptedNotification_success() {
        boolean result = kakaoNotificationService.sendGiftAcceptedNotification(
                "010-1234-5678",
                "주희",
                "김수령",
                "소락사 샌디 도자기 머그",
                22000
        );

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("배송 출발 운송장 알림톡 발송 성공")
    void sendShippingStartedNotification_success() {
        boolean result = kakaoNotificationService.sendShippingStartedNotification(
                "010-9876-5432",
                "김수령",
                "주희",
                "CJ대한통운",
                "6849-3012-9381",
                "https://sharepresent.app/gift/track/test-token"
        );

        assertThat(result).isTrue();
    }
}
