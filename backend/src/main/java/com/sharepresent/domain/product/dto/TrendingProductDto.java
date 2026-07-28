package com.sharepresent.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendingProductDto {
    private Integer rank;
    private Long id;
    private String brand;
    private String name;
    private Integer price;
    private String pickRate;
    private String category;
    private String tag;
    private String imageUrl;
}
