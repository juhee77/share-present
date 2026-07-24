package com.sharepresent.domain.order.entity;

import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curation_box_id")
    private CurationBox curationBox;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_product_id")
    private Product selectedProduct;

    @Column(name = "selected_option")
    private String selectedOption;

    @Column(name = "payment_key")
    private String paymentKey;

    @Column(name = "total_amount", nullable = false)
    private Integer totalAmount;

    @Column(name = "final_amount")
    private Integer finalAmount;

    @Builder.Default
    @Column(name = "refund_amount")
    private Integer refundAmount = 0;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Builder.Default
    @Column(name = "shipping_status", nullable = false)
    private String shippingStatus = "PREPARING";

    @Builder.Default
    @Column(name = "carrier_name")
    private String carrierName = "CJ대한통운";

    @Builder.Default
    @Column(name = "tracking_number")
    private String trackingNumber = "6849-3012-9381";

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "settled_at")
    private LocalDateTime settledAt;
}
