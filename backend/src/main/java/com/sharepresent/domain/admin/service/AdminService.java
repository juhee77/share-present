package com.sharepresent.domain.admin.service;

import com.sharepresent.domain.admin.dto.*;
import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
import com.sharepresent.domain.order.entity.Order;
import com.sharepresent.domain.order.repository.OrderRepository;
import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.support.entity.SupportInquiry;
import com.sharepresent.domain.support.repository.SupportInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final OrderRepository orderRepository;
    private final CurationBoxRepository curationBoxRepository;
    private final ProductRepository productRepository;
    private final SupportInquiryRepository supportInquiryRepository;

    public AdminStatsResponse getDashboardStats() {
        List<Order> orders = orderRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<SupportInquiry> inquiries = supportInquiryRepository.findAll();

        long totalOrders = orders.size();
        long totalGross = orders.stream().mapToLong(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0).sum();
        long totalSettled = orders.stream().mapToLong(o -> o.getFinalAmount() != null ? o.getFinalAmount() : 0).sum();
        long totalRefund = orders.stream().mapToLong(o -> o.getRefundAmount() != null ? o.getRefundAmount() : 0).sum();

        long preparingCount = orders.stream().filter(o -> "PREPARING".equalsIgnoreCase(o.getShippingStatus())).count();
        long shippingCount = orders.stream().filter(o -> "SHIPPING".equalsIgnoreCase(o.getShippingStatus())).count();
        long deliveredCount = orders.stream().filter(o -> "DELIVERED".equalsIgnoreCase(o.getShippingStatus())).count();

        long acceptedCount = orders.stream().filter(o -> o.getSelectedProduct() != null).count();
        double acceptanceRate = totalOrders > 0 ? Math.round(((double) acceptedCount / totalOrders * 100.0) * 10.0) / 10.0 : 0.0;

        long pendingInquiriesCount = inquiries.stream().filter(i -> "IN_PROGRESS".equalsIgnoreCase(i.getStatus())).count();
        long soldOutProductsCount = products.stream().filter(p -> Boolean.TRUE.equals(p.getIsSoldOut())).count();

        return AdminStatsResponse.builder()
                .totalOrders(totalOrders)
                .totalGrossAmount(totalGross)
                .totalSettledAmount(totalSettled)
                .totalRefundAmount(totalRefund)
                .preparingCount(preparingCount)
                .shippingCount(shippingCount)
                .deliveredCount(deliveredCount)
                .waitingAcceptCount(totalOrders - acceptedCount)
                .acceptanceRate(acceptanceRate)
                .pendingInquiriesCount(pendingInquiriesCount)
                .totalProductsCount(products.size())
                .soldOutProductsCount(soldOutProductsCount)
                .build();
    }

    public List<AdminOrderResponse> getAllOrders(String status, String keyword) {
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .filter(o -> {
                    if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
                        return true;
                    }
                    return status.equalsIgnoreCase(o.getShippingStatus());
                })
                .filter(o -> {
                    if (keyword == null || keyword.isBlank()) {
                        return true;
                    }
                    String kw = keyword.toLowerCase();
                    boolean matchRecipient = o.getRecipientName() != null && o.getRecipientName().toLowerCase().contains(kw);
                    boolean matchPhone = o.getRecipientPhone() != null && o.getRecipientPhone().contains(kw);
                    boolean matchSender = o.getSender() != null && (
                            (o.getSender().getNickname() != null && o.getSender().getNickname().toLowerCase().contains(kw)) ||
                            (o.getSender().getEmail() != null && o.getSender().getEmail().toLowerCase().contains(kw))
                    );
                    boolean matchTracking = o.getTrackingNumber() != null && o.getTrackingNumber().contains(kw);
                    return matchRecipient || matchPhone || matchSender || matchTracking;
                })
                .map(this::toAdminOrderResponse)
                .toList();
    }

    public AdminOrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("주문 내역을 찾을 수 없습니다. (ID: " + orderId + ")"));
        return toAdminOrderResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateShipping(Long orderId, UpdateShippingRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("주문 내역을 찾을 수 없습니다. (ID: " + orderId + ")"));

        Order.OrderBuilder builder = order.toBuilder();

        if (request.getShippingStatus() != null && !request.getShippingStatus().isBlank()) {
            builder.shippingStatus(request.getShippingStatus().toUpperCase());
        }
        if (request.getCarrierName() != null && !request.getCarrierName().isBlank()) {
            builder.carrierName(request.getCarrierName());
        }
        if (request.getTrackingNumber() != null && !request.getTrackingNumber().isBlank()) {
            builder.trackingNumber(request.getTrackingNumber());
        }

        Order updated = orderRepository.save(builder.build());
        return toAdminOrderResponse(updated);
    }

    public List<Product> getAllProducts(String category, String keyword) {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(p -> {
                    if (category == null || category.isBlank() || "ALL".equalsIgnoreCase(category)) {
                        return true;
                    }
                    return p.getCategory() != null && p.getCategory().equalsIgnoreCase(category);
                })
                .filter(p -> {
                    if (keyword == null || keyword.isBlank()) {
                        return true;
                    }
                    String kw = keyword.toLowerCase();
                    return (p.getBrand() != null && p.getBrand().toLowerCase().contains(kw)) ||
                            (p.getName() != null && p.getName().toLowerCase().contains(kw));
                })
                .toList();
    }

    @Transactional
    public Product createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .brand(request.getBrand())
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank() 
                        ? request.getImageUrl() 
                        : "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80")
                .category(request.getCategory() != null ? request.getCategory() : "FRAGRANCE")
                .options(request.getOptions() != null ? request.getOptions() : new ArrayList<>())
                .isCustom(false)
                .isSoldOut(false)
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 100)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다. (ID: " + productId + ")"));

        Product.ProductBuilder builder = product.toBuilder()
                .brand(request.getBrand())
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory());

        if (request.getOptions() != null) {
            builder.options(request.getOptions());
        }
        if (request.getIsSoldOut() != null) {
            builder.isSoldOut(request.getIsSoldOut());
        }
        if (request.getStockQuantity() != null) {
            builder.stockQuantity(request.getStockQuantity());
        }

        return productRepository.save(builder.build());
    }

    @Transactional
    public Product updateProductStock(Long productId, UpdateStockRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("상품을 찾을 수 없습니다. (ID: " + productId + ")"));

        Product.ProductBuilder builder = product.toBuilder();
        if (request.getIsSoldOut() != null) {
            builder.isSoldOut(request.getIsSoldOut());
        }
        if (request.getStockQuantity() != null) {
            builder.stockQuantity(request.getStockQuantity());
            if (request.getStockQuantity() <= 0) {
                builder.isSoldOut(true);
            }
        }

        return productRepository.save(builder.build());
    }

    @Transactional
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NoSuchElementException("삭제할 상품이 존재하지 않습니다. (ID: " + productId + ")");
        }
        productRepository.deleteById(productId);
    }

    public List<AdminInquiryResponse> getAllInquiries(String status) {
        List<SupportInquiry> inquiries = supportInquiryRepository.findAllByOrderByCreatedAtDesc();

        return inquiries.stream()
                .filter(i -> {
                    if (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)) {
                        return true;
                    }
                    return status.equalsIgnoreCase(i.getStatus());
                })
                .map(this::toAdminInquiryResponse)
                .toList();
    }

    @Transactional
    public AdminInquiryResponse replyInquiry(String inquiryCode, ReplyInquiryRequest request) {
        SupportInquiry inquiry = supportInquiryRepository.findByInquiryCode(inquiryCode)
                .orElseThrow(() -> new NoSuchElementException("문의 내역을 찾을 수 없습니다. (Code: " + inquiryCode + ")"));

        SupportInquiry updated = inquiry.toBuilder()
                .adminReply(request.getReply())
                .status("ANSWERED")
                .repliedAt(LocalDateTime.now())
                .build();

        SupportInquiry saved = supportInquiryRepository.save(updated);
        return toAdminInquiryResponse(saved);
    }

    private AdminOrderResponse toAdminOrderResponse(Order order) {
        CurationBox box = order.getCurationBox();
        Product product = order.getSelectedProduct();

        return AdminOrderResponse.builder()
                .id(order.getId())
                .curationBoxId(box != null ? box.getId() : null)
                .sharingToken(box != null ? box.getSharingToken() : null)
                .curationBoxStatus(box != null ? box.getStatus() : null)
                .senderName(order.getSender() != null ? order.getSender().getNickname() : "익명 발신자")
                .senderEmail(order.getSender() != null ? order.getSender().getEmail() : null)
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingStatus(order.getShippingStatus())
                .carrierName(order.getCarrierName())
                .trackingNumber(order.getTrackingNumber())
                .selectedProductId(product != null ? product.getId() : null)
                .selectedProductName(product != null ? product.getName() : null)
                .selectedProductBrand(product != null ? product.getBrand() : null)
                .selectedProductPrice(product != null ? product.getPrice() : null)
                .selectedProductImageUrl(product != null ? product.getImageUrl() : null)
                .selectedOption(order.getSelectedOption())
                .totalAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .refundAmount(order.getRefundAmount())
                .paidAt(order.getPaidAt())
                .settledAt(order.getSettledAt())
                .desiredDeliveryDate(order.getDesiredDeliveryDate())
                .ecoFriendlyPackaging(order.getEcoFriendlyPackaging())
                .entranceMemo(order.getEntranceMemo())
                .thankYouSticker(order.getThankYouSticker())
                .thankYouMessage(order.getThankYouMessage())
                .thankYouPhotoUrl(order.getThankYouPhotoUrl())
                .build();
    }

    private AdminInquiryResponse toAdminInquiryResponse(SupportInquiry inquiry) {
        return AdminInquiryResponse.builder()
                .id(inquiry.getId())
                .inquiryCode(inquiry.getInquiryCode())
                .name(inquiry.getName())
                .email(inquiry.getEmail())
                .category(inquiry.getCategory())
                .content(inquiry.getContent())
                .status(inquiry.getStatus())
                .adminReply(inquiry.getAdminReply())
                .repliedAt(inquiry.getRepliedAt())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}
