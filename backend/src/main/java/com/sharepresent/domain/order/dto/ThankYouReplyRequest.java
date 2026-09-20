package com.sharepresent.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThankYouReplyRequest {

    private String thankYouSticker;

    @NotBlank(message = "감사 메시지 내용은 필수입니다.")
    private String thankYouMessage;

    private String thankYouPhotoUrl;
}
