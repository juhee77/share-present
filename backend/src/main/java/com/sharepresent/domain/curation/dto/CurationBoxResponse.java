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
    private Integer maxBudget;
    private String sharingToken;
    private Boolean allowCustomInput;
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
    }
}
