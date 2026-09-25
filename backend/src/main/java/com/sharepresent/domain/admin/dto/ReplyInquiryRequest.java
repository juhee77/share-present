package com.sharepresent.domain.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReplyInquiryRequest {
    @NotBlank(message = "답변 내용은 필수 입력입니다.")
    private String reply;
}
