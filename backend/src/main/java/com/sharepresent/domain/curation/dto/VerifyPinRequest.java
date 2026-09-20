package com.sharepresent.domain.curation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPinRequest {

    @NotBlank(message = "PIN 번호는 필수입니다.")
    private String pin;
}
