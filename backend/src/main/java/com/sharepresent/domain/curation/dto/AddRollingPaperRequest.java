package com.sharepresent.domain.curation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddRollingPaperRequest {

    @NotBlank(message = "작성자 이름은 필수입니다.")
    private String authorName;

    @NotBlank(message = "축하 메시지는 필수입니다.")
    private String message;

    private String avatarEmoji;
}
