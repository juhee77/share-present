package com.sharepresent.domain.order.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Component
public class MockAlimtalkGatewayClient implements AlimtalkGatewayClient {

    @Override
    public AlimtalkSendResponse dispatch(AlimtalkSendRequest request) {
        String messageId = "KAKAO_MSG_" + UUID.randomUUID().toString().substring(0, 8);
        log.info("[Alimtalk Gateway Dispatch] Template: {}, Recipient: {}, MsgId: {}",
                request.getTemplateCode(), request.getRecipientPhone(), messageId);

        return AlimtalkSendResponse.builder()
                .success(true)
                .messageId(messageId)
                .statusCode("2000")
                .statusMessage("SUCCESS")
                .sentAt(LocalDateTime.now())
                .build();
    }
}
