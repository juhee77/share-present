package com.sharepresent.domain.order.client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlimtalkSendResponse {
    private boolean success;
    private String messageId;
    private String statusCode;
    private String statusMessage;
    private LocalDateTime sentAt;
}
