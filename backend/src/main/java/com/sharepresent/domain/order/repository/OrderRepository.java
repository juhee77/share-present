package com.sharepresent.domain.order.repository;

import com.sharepresent.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByCurationBoxId(Long curationBoxId);

    @Query("SELECT o.selectedProduct.id, COUNT(o.id) FROM Order o WHERE o.selectedProduct IS NOT NULL GROUP BY o.selectedProduct.id ORDER BY COUNT(o.id) DESC")
    List<Object[]> findMostGiftedProductCounts();
}
