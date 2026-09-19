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

    @Test
    @DisplayName("선물 기한(7일) 만료 전액 환불 알림톡 발송 성공")
    void sendGiftExpiredNotification_success() {
        boolean result = kakaoNotificationService.sendGiftExpiredNotification(
                "010-1234-5678",
                "주희",
                60000
        );

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("선물 수락 마감 임박 리마인더 알림톡 발송 성공")
    void sendGiftReminderNotification_success() {
        boolean result = kakaoNotificationService.sendGiftReminderNotification(
                "010-9876-5432",
                "김수령",
                "주희",
                3,
                "https://sharepresent.app/gift/test-token"
        );

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("수령인 감사 답장 카드 도착 알림톡 발송 성공")
    void sendThankYouCardNotification_success() {
        boolean result = kakaoNotificationService.sendThankYouCardNotification(
                "010-1234-5678",
                "주희",
                "김수령",
                "정말 감동이에요! 매일 아침 잘 쓰고 있습니다."
        );

        assertThat(result).isTrue();
    }
}
