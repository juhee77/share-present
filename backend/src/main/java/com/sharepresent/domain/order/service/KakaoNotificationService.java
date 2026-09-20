package com.sharepresent.domain.order.service;

import com.sharepresent.domain.order.client.AlimtalkGatewayClient;
import com.sharepresent.domain.order.client.AlimtalkSendRequest;
import com.sharepresent.domain.order.client.AlimtalkSendResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoNotificationService {

    private final AlimtalkGatewayClient alimtalkGatewayClient;

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

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(senderPhone)
                .templateCode("SP_GIFT_ACCEPTED_V1")
                .title("선물 수락 완료 및 정산 안내")
                .message(message)
                .build());

        log.info("[Kakao Alimtalk Sent to Sender ({}) - MsgId: {}]\n{}", senderPhone, response.getMessageId(), message);
        return response.isSuccess();
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

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(receiverPhone)
                .templateCode("SP_SHIPPING_STARTED_V1")
                .title("선물 배송 출발 안내")
                .message(message)
                .buttonName("실시간 배송 조회")
                .buttonUrl(trackingUrl)
                .build());

        log.info("[Kakao Alimtalk Sent to Recipient ({}) - MsgId: {}]\n{}", receiverPhone, response.getMessageId(), message);
        return response.isSuccess();
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

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(senderPhone)
                .templateCode("SP_GIFT_EXPIRED_REFUND_V1")
                .title("선물함 기한 만료 및 자동 전액 환불 안내")
                .message(message)
                .build());

        log.info("[Kakao Alimtalk Sent to Sender ({}) - MsgId: {}]\n{}", senderPhone, response.getMessageId(), message);
        return response.isSuccess();
    }

    /**
     * 수령인에게 선물 수락 마감 임박을 알리는 리마인더 알림톡
     */
    public boolean sendGiftReminderNotification(String receiverPhone, String receiverName, String senderName, int daysLeft, String giftLink) {
        String message = String.format(
                "[SharePresent 알림톡] 🎁\n\n" +
                "안녕하세요, %s님!\n" +
                "%s님이 보내신 마음 담긴 선물의 수락 기한이 %d일 남았습니다.\n\n" +
                "• 선물 링크: %s\n\n" +
                "마음에 드는 옵션을 고르고 배송지를 입력하시면 프리미엄 부티크 패키징으로 전해드립니다 ✦",
                receiverName, senderName, daysLeft, giftLink
        );

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(receiverPhone)
                .templateCode("SP_GIFT_REMINDER_V1")
                .title("선물 수락 마감 임박 리마인더")
                .message(message)
                .buttonName("선물 수락하러 가기")
                .buttonUrl(giftLink)
                .build());

        log.info("[Kakao Alimtalk Reminder Sent to Recipient ({}) - MsgId: {}]\n{}", receiverPhone, response.getMessageId(), message);
        return response.isSuccess();
    }

    /**
     * 수령인이 감사 답장 카드를 등록했을 때 송신자에게 발송하는 알림톡
     */
    public boolean sendThankYouCardNotification(String senderPhone, String senderName, String receiverName, String thankYouSnippet) {
        String message = String.format(
                "[SharePresent 알림톡] 💌\n\n" +
                "안녕하세요, %s님!\n" +
                "%s님이 소중한 감사 답장 카드를 남겨주셨습니다.\n\n" +
                "\"%s\"\n\n" +
                "SharePresent 대시보드에서 전문을 확인하실 수 있습니다.",
                senderName, receiverName, thankYouSnippet
        );

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(senderPhone)
                .templateCode("SP_THANK_YOU_CARD_V1")
                .title("수령인 감사 답장 도착 안내")
                .message(message)
                .build());

        log.info("[Kakao Alimtalk Thank You Card Sent to Sender ({}) - MsgId: {}]\n{}", senderPhone, response.getMessageId(), message);
        return response.isSuccess();
    }

    /**
     * 선물 상자 최초 발송 또는 재발송 시 수령인에게 발송하는 선물 도착 알림톡
     */
    public boolean sendGiftCreatedNotification(String receiverPhone, String senderName, String receiverName, String giftLink) {
        String message = String.format(
                "[SharePresent 알림톡] 🎁\n\n" +
                "안녕하세요, %s님!\n" +
                "%s님이 소중한 마음을 담아 고른 선물 상자를 보내셨습니다.\n\n" +
                "• 선물 링크: %s\n\n" +
                "원하시는 취향의 옵션과 배송지를 입력해 주시면 예쁘게 포장하여 전해드립니다 ✦",
                receiverName, senderName, giftLink
        );

        AlimtalkSendResponse response = alimtalkGatewayClient.dispatch(AlimtalkSendRequest.builder()
                .recipientPhone(receiverPhone)
                .templateCode("SP_GIFT_INVITATION_V1")
                .title("선물 상자 도착 안내")
                .message(message)
                .buttonName("선물 확인하기")
                .buttonUrl(giftLink)
                .build());

        log.info("[Kakao Alimtalk Invitation Sent to Recipient ({}) - MsgId: {}]\n{}", receiverPhone, response.getMessageId(), message);
        return response.isSuccess();
    }
}

