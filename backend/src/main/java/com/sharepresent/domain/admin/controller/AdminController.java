package com.sharepresent.domain.admin.controller;

import com.sharepresent.domain.admin.dto.*;
import com.sharepresent.domain.admin.service.AdminService;
import com.sharepresent.domain.product.entity.Product;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Admin API", description = "어드민 관리자 통계, 주문/배송, 상품/재고, 고객센터 통합 관리 API")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "어드민 대시보드 통계", description = "총 주문수, 가승인/정산/환불 금액, 배송 단계별 카운트, 선물 수락률, 미답변 문의수 등 핵심 KPI를 반환합니다.")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/orders")
    @Operation(summary = "주문 및 배송 목록 조회", description = "상태 및 검색어 필터링을 통해 전체 주문 목록을 조회합니다.")
    public ResponseEntity<List<AdminOrderResponse>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(adminService.getAllOrders(status, keyword));
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "주문 상세 조회", description = "단일 주문의 상세 배송 정보, 결제 내역, 수령인 포토/메시지를 조회합니다.")
    public ResponseEntity<AdminOrderResponse> getOrder(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(adminService.getOrderById(orderId));
    }

    @PatchMapping("/orders/{orderId}/shipping")
    @Operation(summary = "배송 상태 및 운송장 업데이트", description = "배송 상태(PREPARING, SHIPPING, DELIVERED)와 택배사 및 운송장 번호를 수정합니다.")
    public ResponseEntity<AdminOrderResponse> updateShipping(
            @PathVariable("orderId") Long orderId,
            @Valid @RequestBody UpdateShippingRequest request
    ) {
        return ResponseEntity.ok(adminService.updateShipping(orderId, request));
    }

    @GetMapping("/products")
    @Operation(summary = "어드민 상품 카탈로그 조회", description = "전체 등록 상품 목록을 카테고리/키워드로 조회합니다.")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(adminService.getAllProducts(category, keyword));
    }

    @PostMapping("/products")
    @Operation(summary = "신규 상품 등록", description = "새로운 럭셔리 브랜드 상품을 카탈로그에 등록합니다.")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createProduct(request));
    }

    @PutMapping("/products/{productId}")
    @Operation(summary = "상품 정보 수정", description = "기존 상품의 가격, 설명, 이미지, 카테고리 등을 수정합니다.")
    public ResponseEntity<Product> updateProduct(
            @PathVariable("productId") Long productId,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        return ResponseEntity.ok(adminService.updateProduct(productId, request));
    }

    @PatchMapping("/products/{productId}/stock")
    @Operation(summary = "재고 및 품절 상태 변경", description = "상품의 재고 수량과 품절(Sold-out) 상태를 변경합니다.")
    public ResponseEntity<Product> updateProductStock(
            @PathVariable("productId") Long productId,
            @RequestBody UpdateStockRequest request
    ) {
        return ResponseEntity.ok(adminService.updateProductStock(productId, request));
    }

    @DeleteMapping("/products/{productId}")
    @Operation(summary = "상품 삭제", description = "카탈로그에서 해당 상품을 삭제합니다.")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable("productId") Long productId) {
        adminService.deleteProduct(productId);
        return ResponseEntity.ok(Map.of("message", "상품이 성공적으로 삭제되었습니다."));
    }

    @GetMapping("/inquiries")
    @Operation(summary = "1:1 문의 목록 조회", description = "고객들이 접수한 1:1 문의 목록을 상태별로 조회합니다.")
    public ResponseEntity<List<AdminInquiryResponse>> getInquiries(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getAllInquiries(status));
    }

    @PostMapping("/inquiries/{inquiryCode}/reply")
    @Operation(summary = "1:1 문의 답변 등록", description = "고객 문의에 대한 관리자 답변을 등록하고 상태를 답변 완료(ANSWERED)로 변경합니다.")
    public ResponseEntity<AdminInquiryResponse> replyInquiry(
            @PathVariable("inquiryCode") String inquiryCode,
            @Valid @RequestBody ReplyInquiryRequest request
    ) {
        return ResponseEntity.ok(adminService.replyInquiry(inquiryCode, request));
    }
}
