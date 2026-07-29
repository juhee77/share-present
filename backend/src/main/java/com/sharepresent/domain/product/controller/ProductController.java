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

    @GetMapping("/md-picks")
    public ResponseEntity<List<com.sharepresent.domain.product.dto.MdPickProductDto>> getMdPicks() {
        List<Product> allProducts = productRepository.findAll();
        List<com.sharepresent.domain.product.dto.MdPickProductDto> mdPicks = new java.util.ArrayList<>();

        if (allProducts.size() >= 3) {
            mdPicks.add(com.sharepresent.domain.product.dto.MdPickProductDto.builder()
                    .id(allProducts.get(1).getId())
                    .brand(allProducts.get(1).getBrand())
                    .name(allProducts.get(1).getName())
                    .price(allProducts.get(1).getPrice())
                    .description(allProducts.get(1).getDescription())
                    .editorBadge("🌟 Editor's Top Pick")
                    .mdComment("방 안을 감싸는 서늘하고 은은한 오크모스 향. 남녀노소 호불호 없이 모두가 만족하는 시그니처 1위 선물.")
                    .imageUrl(allProducts.get(1).getImageUrl())
                    .options(allProducts.get(1).getOptions())
                    .build());

            mdPicks.add(com.sharepresent.domain.product.dto.MdPickProductDto.builder()
                    .id(allProducts.get(0).getId())
                    .brand(allProducts.get(0).getBrand())
                    .name(allProducts.get(0).getName())
                    .price(allProducts.get(0).getPrice())
                    .description(allProducts.get(0).getDescription())
                    .editorBadge("☕ Tableware Pick")
                    .mdComment("설악산의 모래 질감을 미니멀하게 표현한 내추럴 도자기 컵. 데일리 오피스 머그로 강력 추천합니다.")
                    .imageUrl(allProducts.get(0).getImageUrl())
                    .options(allProducts.get(0).getOptions())
                    .build());

            mdPicks.add(com.sharepresent.domain.product.dto.MdPickProductDto.builder()
                    .id(allProducts.get(6).getId())
                    .brand("TAMBURINS")
                    .name("퍼퓸 핸드크림 CHAMO (30ml)")
                    .price(32000)
                    .description("진득한 카모마일과 부드러운 우디 가드의 부드러움.")
                    .editorBadge("✨ Fragrance Pick")
                    .mdComment("진득한 카모마일의 약초 향과 은은한 세이지의 조화. 주는 이와 받는 이 모두 감각적인 기분 유도.")
                    .imageUrl("https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80")
                    .options(List.of("CHAMO", "BERGA SANDAL", "LALE"))
                    .build());
        }

        return ResponseEntity.ok(mdPicks);
    }
}
