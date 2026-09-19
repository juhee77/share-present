package com.sharepresent.domain.order.client;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AlimtalkGatewayClientTest {

    private final AlimtalkGatewayClient client = new MockAlimtalkGatewayClient();

    @Test
    @DisplayName("알림톡 비즈메시지 게이트웨이 발송 디스패치 성공")
    void dispatch_success() {
        AlimtalkSendRequest request = AlimtalkSendRequest.builder()
                .recipientPhone("010-1234-5678")
                .templateCode("SP_GIFT_ACCEPTED_V1")
                .title("선물 수락 완료")
                .message("선물 수락이 완료되었습니다.")
                .buttonName("배송 조회")
                .buttonUrl("https://sharepresent.app/gift/track/sample")
                .build();

        AlimtalkSendResponse response = client.dispatch(request);

        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessageId()).startsWith("KAKAO_MSG_");
        assertThat(response.getStatusCode()).isEqualTo("2000");
    }
}
