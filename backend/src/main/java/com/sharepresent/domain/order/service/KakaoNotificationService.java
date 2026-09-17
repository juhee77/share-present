package com.sharepresent.domain.order.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class KakaoNotificationService {

    /**
     * 수령인이 선물을 수락하고 배송지를 입력했을 때 송신자에게 발송하는 카카오 알림톡
     */
    public boolean sendGiftAcceptedNotification(String senderPhone, String senderName, String receiverName, String productName, int refundAmount) {
        String message = String.format(
                "[SharePresent 알림톡] 💌\n\n" +
                "안녕하세요, %s님!\n" +
                "%s님이 보내주신 선물 상자에서 선물을 선택하고 배송지를 입력하셨습니다.\n\n" +
                "• 선택 상품: %s\n" +
                "• 차액 자동 환불: %d원 (즉시 처리 완료)\n\n" +
                "부티크 패키징 후 정성껏 포장하여 안전하게 배송해 드리겠습니다.",
                senderName, receiverName, productName, refundAmount
        );

        log.info("[Kakao Alimtalk Sent to Sender ({})]\n{}", senderPhone, message);
        return true;
    }

    /**
     * 택배 출고 시 수령인에게 발송하는 운송장 알림톡
     */
    public boolean sendShippingStartedNotification(String receiverPhone, String receiverName, String senderName, String carrierName, String trackingNumber, String trackingUrl) {
        String message = String.format(
                "[SharePresent 알림톡] 🚚\n\n" +
                "안녕하세요, %s님!\n" +
                "%s님이 보내신 소중한 선물이 출고되어 배송이 시작되었습니다.\n\n" +
                "• 택배사: %s\n" +
                "• 운송장 번호: %s\n" +
                "• 실시간 배송 조회: %s\n\n" +
                "설레는 마음으로 기다려주세요 🎁",
                receiverName, senderName, carrierName, trackingNumber, trackingUrl
        );

        log.info("[Kakao Alimtalk Sent to Recipient ({})]\n{}", receiverPhone, message);
        return true;
    }

    /**
     * 선물 수락 기한(7일) 만료 시 송신자에게 발송하는 자동 전액 환불 알림톡
     */
    public boolean sendGiftExpiredNotification(String senderPhone, String senderName, int refundAmount) {
        String message = String.format(
                "[SharePresent 알림톡] ⏳\n\n" +
                "안녕하세요, %s님!\n" +
                "보내주신 선물함의 수락 기한(7일)이 만료되었습니다.\n\n" +
                "• 가승인 취소/환불액: %d원 (전액 100%% 자동 환불)\n" +
                "• 결제하신 카드사를 통해 1~3 영업일 내 취소 완료됩니다.\n\n" +
                "언제든 새로운 선물 큐레이션을 시작해보세요 ✦",
                senderName, refundAmount
        );

        log.info("[Kakao Alimtalk Sent to Sender ({})]\n{}", senderPhone, message);
        return true;
    }
}
