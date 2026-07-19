package com.sharepresent.domain.order.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcceptGiftRequest {

    @NotBlank(message = "받는 사람 성함은 필수입니다.")
    private String receiverName;

    @NotBlank(message = "연락처는 필수입니다.")
    private String receiverPhone;

    @NotBlank(message = "배송 주소는 필수입니다.")
    private String shippingAddress;

    // Standard selected product (if not recipient-added custom)
    private Long selectedProductId;

    private String selectedOption;

    // Fields if recipient added their own custom product dynamically
    private Boolean isRecipientAdded;
    private String recipientCustomBrand;
    private String recipientCustomName;
    private String recipientCustomUrl;
}
