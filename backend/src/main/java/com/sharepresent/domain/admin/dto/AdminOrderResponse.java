package com.sharepresent.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminOrderResponse {
    private Long id;
    private Long curationBoxId;
    private String sharingToken;
    private String senderName;
    private String senderEmail;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String shippingStatus;
    private String carrierName;
    private String trackingNumber;
    private Long selectedProductId;
    private String selectedProductName;
    private String selectedProductBrand;
    private Integer selectedProductPrice;
    private String selectedProductImageUrl;
    private String selectedOption;
    private Integer totalAmount;
    private Integer finalAmount;
    private Integer refundAmount;
    private LocalDateTime paidAt;
    private LocalDateTime settledAt;
    private String desiredDeliveryDate;
    private Boolean ecoFriendlyPackaging;
    private String entranceMemo;
    private String thankYouSticker;
    private String thankYouMessage;
    private String thankYouPhotoUrl;
    private String curationBoxStatus;
}
