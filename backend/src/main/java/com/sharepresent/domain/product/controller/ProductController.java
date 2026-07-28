package com.sharepresent.domain.product.controller;

import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final com.sharepresent.domain.product.service.NaverProductSearchService naverProductSearchService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) Integer minBudget,
            @RequestParam(required = false) Integer maxBudget,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        List<Product> products = productRepository.findAll();

        // Dynamic Filtering
        if (minBudget != null && maxBudget != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minBudget && p.getPrice() <= maxBudget)
                    .toList();
        }

        if (keyword != null && !keyword.isBlank()) {
            String lowerKw = keyword.toLowerCase();
            products = products.stream()
                    .filter(p -> p.getBrand().toLowerCase().contains(lowerKw) || p.getName().toLowerCase().contains(lowerKw))
                    .toList();
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchOpenProducts(@RequestParam String query) {
        List<Product> results = naverProductSearchService.searchProducts(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<com.sharepresent.domain.product.dto.TrendingProductDto>> getTrendingProducts() {
        List<Product> allProducts = productRepository.findAll();
        List<com.sharepresent.domain.product.dto.TrendingProductDto> trendingList = new java.util.ArrayList<>();

        String[] tags = {"🔥 수령인 선택률 1위", "✨ 2030 선물 베스트", "🌿 스테디셀러", "💎 럭셔리 기프트", "☕ 감성 오피스 베스트", "🍃 스파 릴랙싱", "🍽️ 신혼/집들이 베스트", "✨ 프리미엄 세트"};
        String[] rates = {"48%", "42%", "38%", "34%", "32%", "28%", "24%", "19%"};
        String[] categories = {"향수/인테리어", "핸드케어", "핸드케어", "홈프래그런스", "테이블웨어", "바디/스파", "테이블웨어", "홈프래그런스"};

        int count = Math.min(8, allProducts.size());
        for (int i = 0; i < count; i++) {
            Product p = allProducts.get(i);
            trendingList.add(com.sharepresent.domain.product.dto.TrendingProductDto.builder()
                    .rank(i + 1)
                    .id(p.getId())
                    .brand(p.getBrand())
                    .name(p.getName())
                    .price(p.getPrice())
                    .pickRate(rates[i % rates.length])
                    .category(categories[i % categories.length])
                    .tag(tags[i % tags.length])
                    .imageUrl(p.getImageUrl() != null ? p.getImageUrl() : "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80")
                    .build());
        }

        return ResponseEntity.ok(trendingList);
    }
}
