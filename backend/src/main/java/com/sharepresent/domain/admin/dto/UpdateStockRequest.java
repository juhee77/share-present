package com.sharepresent.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStockRequest {
    private Boolean isSoldOut;
    private Integer stockQuantity;
}
