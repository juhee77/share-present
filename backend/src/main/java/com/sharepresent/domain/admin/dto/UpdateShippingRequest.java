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
public class UpdateShippingRequest {
    @NotBlank(message = "배송 상태는 필수입니다. (PREPARING, SHIPPING, DELIVERED)")
    private String shippingStatus;

    private String carrierName;

    private String trackingNumber;
}
