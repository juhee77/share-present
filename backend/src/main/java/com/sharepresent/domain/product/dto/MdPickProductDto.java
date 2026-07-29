package com.sharepresent.domain.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MdPickProductDto {
    private Long id;
    private String brand;
    private String name;
    private Integer price;
    private String description;
    private String mdComment;
    private String editorBadge;
    private String imageUrl;
    private List<String> options;
}
