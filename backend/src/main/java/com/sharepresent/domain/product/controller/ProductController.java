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
}
