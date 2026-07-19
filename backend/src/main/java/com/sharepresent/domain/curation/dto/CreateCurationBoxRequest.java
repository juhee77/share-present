package com.sharepresent.domain.curation.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCurationBoxRequest {

    @NotNull(message = "보내는 사람 ID는 필수입니다.")
    private Long senderId;

    @NotNull(message = "최대 예산 한도는 필수입니다.")
    @Min(value = 0, message = "예산은 0원 이상이어야 합니다.")
    private Integer maxBudget;

    private String messageCard;

    private Boolean allowCustomInput;

    private List<Long> productIds;

    private List<CustomProductRequest> customProducts;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomProductRequest {
        @NotBlank(message = "브랜드명은 필수입니다.")
        private String brand;

        @NotBlank(message = "상품명은 필수입니다.")
        private String name;

        private String description;

        @NotBlank(message = "상품 링크는 필수입니다.")
        private String externalUrl;

        private List<String> options;

        private String icon;
    }
}
