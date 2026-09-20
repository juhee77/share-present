package com.sharepresent.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModifyAddressRequest {

    private String receiverName;

    private String receiverPhone;

    @NotBlank(message = "변경할 배송 주소는 필수입니다.")
    private String shippingAddress;

    private String deliveryMemo;

    private String desiredDeliveryDate;
}
