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
import com.sharepresent.domain.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CurationBoxRepository curationBoxRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupportInquiryRepository supportInquiryRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    @DisplayName("대시보드 통계 계산이 정확히 수행된다")
    void getDashboardStats_success() {
        // given
        User sender = User.builder().id(1L).nickname("김발신").email("sender@test.com").build();
        Product product = Product.builder().id(10L).brand("Aesop").name("레저렉션 핸드 밤").price(45000).build();
        
        Order order1 = Order.builder()
                .id(101L)
                .sender(sender)
                .totalAmount(100000)
                .finalAmount(45000)
                .refundAmount(55000)
                .selectedProduct(product)
                .shippingStatus("SHIPPING")
                .build();

        Order order2 = Order.builder()
                .id(102L)
                .sender(sender)
                .totalAmount(80000)
                .shippingStatus("PREPARING")
                .build();

        given(orderRepository.findAll()).willReturn(List.of(order1, order2));
        given(productRepository.findAll()).willReturn(List.of(product));
        given(supportInquiryRepository.findAll()).willReturn(List.of(
                SupportInquiry.builder().inquiryCode("INQ-1").status("IN_PROGRESS").name("문의자").email("a@b.com").content("문의").build()
        ));

        // when
        AdminStatsResponse stats = adminService.getDashboardStats();

        // then
        assertThat(stats.getTotalOrders()).isEqualTo(2);
        assertThat(stats.getTotalGrossAmount()).isEqualTo(180000);
        assertThat(stats.getTotalSettledAmount()).isEqualTo(45000);
        assertThat(stats.getTotalRefundAmount()).isEqualTo(55000);
        assertThat(stats.getShippingCount()).isEqualTo(1);
        assertThat(stats.getPreparingCount()).isEqualTo(1);
        assertThat(stats.getAcceptanceRate()).isEqualTo(50.0);
        assertThat(stats.getPendingInquiriesCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("배송 상태 및 운송장 정보 수정이 정상적으로 반영된다")
    void updateShipping_success() {
        // given
        Order order = Order.builder()
                .id(201L)
                .shippingStatus("PREPARING")
                .carrierName("CJ대한통운")
                .trackingNumber("1111-2222")
                .build();

        given(orderRepository.findById(201L)).willReturn(Optional.of(order));
        given(orderRepository.save(any(Order.class))).willAnswer(invocation -> invocation.getArgument(0));

        UpdateShippingRequest request = UpdateShippingRequest.builder()
                .shippingStatus("SHIPPING")
                .carrierName("우체국택배")
                .trackingNumber("9999-8888")
                .build();

        // when
        AdminOrderResponse response = adminService.updateShipping(201L, request);

        // then
        assertThat(response.getShippingStatus()).isEqualTo("SHIPPING");
        assertThat(response.getCarrierName()).isEqualTo("우체국택배");
        assertThat(response.getTrackingNumber()).isEqualTo("9999-8888");
    }

    @Test
    @DisplayName("신규 상품 등록이 정상 처리된다")
    void createProduct_success() {
        // given
        CreateProductRequest request = CreateProductRequest.builder()
                .brand("Le Labo")
                .name("상탈 33")
                .price(130000)
                .category("FRAGRANCE")
                .description("스모키한 우디 향")
                .stockQuantity(50)
                .options(List.of("50ml", "100ml"))
                .build();

        Product savedProduct = Product.builder()
                .id(1L)
                .brand(request.getBrand())
                .name(request.getName())
                .price(request.getPrice())
                .category(request.getCategory())
                .description(request.getDescription())
                .stockQuantity(50)
                .options(request.getOptions())
                .build();

        given(productRepository.save(any(Product.class))).willReturn(savedProduct);

        // when
        Product result = adminService.createProduct(request);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getBrand()).isEqualTo("Le Labo");
        assertThat(result.getPrice()).isEqualTo(130000);
    }

    @Test
    @DisplayName("1:1 고객 문의 답변 등록 시 상태가 ANSWERED로 변경된다")
    void replyInquiry_success() {
        // given
        SupportInquiry inquiry = SupportInquiry.builder()
                .id(1L)
                .inquiryCode("INQ-999")
                .name("김고객")
                .email("cust@test.com")
                .content("배송일 변경하고 싶습니다")
                .status("IN_PROGRESS")
                .build();

        given(supportInquiryRepository.findByInquiryCode("INQ-999")).willReturn(Optional.of(inquiry));
        given(supportInquiryRepository.save(any(SupportInquiry.class))).willAnswer(invocation -> invocation.getArgument(0));

        ReplyInquiryRequest request = ReplyInquiryRequest.builder()
                .reply("금요일 배송으로 처리해드렸습니다.")
                .build();

        // when
        AdminInquiryResponse response = adminService.replyInquiry("INQ-999", request);

        // then
        assertThat(response.getStatus()).isEqualTo("ANSWERED");
        assertThat(response.getAdminReply()).isEqualTo("금요일 배송으로 처리해드렸습니다.");
        assertThat(response.getRepliedAt()).isNotNull();
    }
}
