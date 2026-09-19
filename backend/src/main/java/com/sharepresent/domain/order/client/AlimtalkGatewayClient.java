package com.sharepresent.domain.order.client;

public interface AlimtalkGatewayClient {
    AlimtalkSendResponse dispatch(AlimtalkSendRequest request);
}
