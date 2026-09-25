package com.sharepresent.domain.admin.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {
    @NotBlank(message = "브랜드명은 필수입니다.")
    private String brand;

    @NotBlank(message = "상품명은 필수입니다.")
    private String name;

    @NotNull(message = "가격은 필수입니다.")
    @Min(value = 1000, message = "가격은 최소 1,000원 이상이어야 합니다.")
    private Integer price;

    private String description;

    private String imageUrl;

    private String category;

    private List<String> options;

    private Boolean isSoldOut;

    private Integer stockQuantity;
}
