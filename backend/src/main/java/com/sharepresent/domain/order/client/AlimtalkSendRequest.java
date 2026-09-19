package com.sharepresent.domain.order.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlimtalkSendRequest {
    private String recipientPhone;
    private String templateCode;
    private String title;
    private String message;
    private String buttonName;
    private String buttonUrl;
}
