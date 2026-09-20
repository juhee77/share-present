package com.sharepresent.domain.curation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateAiMessageRequest {

    @NotBlank(message = "선물 상황은 필수입니다.")
    private String situation;

    private String tone;

    private String receiverName;

    private String senderName;

    private String relationship;

    private String customKeyword;
}
