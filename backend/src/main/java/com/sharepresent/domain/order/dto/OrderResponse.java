package com.sharepresent.domain.order.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private String selectedProductName;
    private String selectedProductBrand;
    private String selectedOption;
    private String shippingStatus;
    private Integer lockedAmount;
    private Integer finalAmount;
    private Integer refundAmount;
    private String status;
    private String externalUrl;
}
