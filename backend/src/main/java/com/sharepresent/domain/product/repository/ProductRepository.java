package com.sharepresent.domain.product.repository;

import com.sharepresent.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsCustomFalse();
    List<Product> findByIsCustomTrueAndOwnerId(Long ownerId);
}
