package com.sharepresent.domain.order.service;

import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
import com.sharepresent.domain.order.dto.AcceptGiftRequest;
import com.sharepresent.domain.order.dto.OrderResponse;
import com.sharepresent.domain.order.entity.Order;
import com.sharepresent.domain.order.repository.OrderRepository;
import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.user.entity.User;
import com.sharepresent.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CurationBoxRepository curationBoxRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private KakaoNotificationService kakaoNotificationService;

    @InjectMocks
    private OrderService orderService;

    private User testSender;
    private CurationBox testBox;
    private Product testProduct;
    private Order testPrePaidOrder;

    @BeforeEach
    void setUp() {
        testSender = User.builder()
                .id(1L)
                .email("sender@sharepresent.com")
                .nickname("주희")
                .build();

        testBox = CurationBox.builder()
                .id(100L)
                .sender(testSender)
                .minBudget(30000)
                .maxBudget(60000)
                .sharingToken("test-token-123456")
                .messageCard("선물 골라봐!")
                .build();

        testProduct = Product.builder()
                .id(10L)
                .brand("OIMU")
                .name("소락사 샌디 도자기 머그")
                .price(38000)
                .isCustom(false)
                .build();

        testPrePaidOrder = Order.builder()
                .id(500L)
                .curationBox(testBox)
                .sender(testSender)
                .totalAmount(60000) // Locked max budget
                .paymentKey("mock_key")
                .shippingStatus("PAID")
                .build();
    }

    @Test
    @DisplayName("선물 수락 및 정산 - 선택 상품 차액 자동 부분 환불액 계산 검증 (60,000 - 38,000 = 22,000원)")
    void acceptAndSettleGift_standardProduct_calculatesRefundCorrectly() {
        // given
        AcceptGiftRequest request = AcceptGiftRequest.builder()
                .receiverName("김수령")
                .receiverPhone("010-9876-5432")
                .shippingAddress("서울특별시 강남구 테헤란로 152")
                .selectedProductId(10L)
                .selectedOption("샌드 화이트")
                .isRecipientAdded(false)
                .build();

        given(curationBoxRepository.findBySharingToken("test-token-123456")).willReturn(Optional.of(testBox));
        given(orderRepository.findByCurationBoxId(100L)).willReturn(Optional.of(testPrePaidOrder));
        given(userRepository.findByEmail(any())).willReturn(Optional.empty());
        given(userRepository.save(any(User.class))).willAnswer(inv -> inv.getArgument(0));
        given(productRepository.findById(10L)).willReturn(Optional.of(testProduct));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));
        given(curationBoxRepository.save(any(CurationBox.class))).willAnswer(inv -> inv.getArgument(0));

        // when
        OrderResponse response = orderService.acceptAndSettleGift("test-token-123456", request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getSelectedProductName()).isEqualTo("소락사 샌디 도자기 머그");
        assertThat(response.getSelectedProductBrand()).isEqualTo("OIMU");
        assertThat(response.getSelectedOption()).isEqualTo("샌드 화이트");
        assertThat(response.getLockedAmount()).isEqualTo(60000);
        assertThat(response.getFinalAmount()).isEqualTo(38000);
        assertThat(response.getRefundAmount()).isEqualTo(22000); // 60,000 - 38,000 = 22,000 KRW
        assertThat(response.getShippingStatus()).isEqualTo("COMPLETED");
    }
}
