package com.sharepresent.domain.curation.dto;

import lombok.*;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CurationBoxResponse {

    private Long id;
    private String senderName;
    private String messageCard;
    private String cardTheme;
    private String fontStyle;
    private String packagingStyle;
    private Boolean hasPinSecurity;
    private Integer minBudget;
    private Integer maxBudget;
    private String sharingToken;
    private Boolean allowCustomInput;
    private String expiredAt;
    private List<ProductDto> items;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDto {
        private Long id;
        private String brand;
        private String name;
        private Integer price;
        private String description;
        private String imageUrl;
        private String externalUrl;
        private List<String> options;
        private Boolean isCustom;
        private String icon;
        private Boolean isSoldOut;
        private Integer stockQuantity;
    }
}
