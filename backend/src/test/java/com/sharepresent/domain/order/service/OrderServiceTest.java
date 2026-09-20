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

    @Test
    @DisplayName("7일 미수락 선물 만료 처리 - 상태 EXPIRED 갱신 및 가승인 60,000원 100% 전액 환불 검증")
    void expireAndRefundUnclaimedGiftBoxes_expiredBoxes_processesFullRefund() {
        // given
        java.time.LocalDateTime threshold = java.time.LocalDateTime.now().minusDays(7);
        given(curationBoxRepository.findByStatusInAndCreatedAtBefore(any(), any()))
                .willReturn(java.util.List.of(testBox));
        given(orderRepository.findByCurationBoxId(100L))
                .willReturn(Optional.of(testPrePaidOrder));
        given(curationBoxRepository.save(any(CurationBox.class))).willAnswer(inv -> inv.getArgument(0));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));

        // when
        int count = orderService.expireAndRefundUnclaimedGiftBoxes(threshold);

        // then
        assertThat(count).isEqualTo(1);
    }

    @Test
    @DisplayName("수령인 감사 카드 및 포토 등록 - Order 엔티티 갱신 및 응답 DTO 반영 검증")
    void submitThankYouReply_updatesOrderWithStickerAndPhoto() {
        // given
        com.sharepresent.domain.order.dto.ThankYouReplyRequest request =
                com.sharepresent.domain.order.dto.ThankYouReplyRequest.builder()
                        .thankYouSticker("💖 취향저격 고마워!")
                        .thankYouMessage("선물 너무 잘 쓸게!")
                        .thankYouPhotoUrl("https://example.com/unboxing.jpg")
                        .build();

        given(curationBoxRepository.findBySharingToken("test-token-123456")).willReturn(Optional.of(testBox));
        given(orderRepository.findByCurationBoxId(100L)).willReturn(Optional.of(testPrePaidOrder));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));

        // when
        OrderResponse response = orderService.submitThankYouReply("test-token-123456", request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getThankYouSticker()).isEqualTo("💖 취향저격 고마워!");
        assertThat(response.getThankYouMessage()).isEqualTo("선물 너무 잘 쓸게!");
        assertThat(response.getThankYouPhotoUrl()).isEqualTo("https://example.com/unboxing.jpg");
    }

    @Test
    @DisplayName("출고 전 수령인 배송지 및 희망 배송일 변경 - Order 엔티티 갱신 검증")
    void modifyRecipientAddress_success() {
        // given
        com.sharepresent.domain.order.dto.ModifyAddressRequest request =
                com.sharepresent.domain.order.dto.ModifyAddressRequest.builder()
                        .receiverName("김수령")
                        .receiverPhone("010-9999-8888")
                        .shippingAddress("서울특별시 용산구 한남대로 91")
                        .desiredDeliveryDate("WEEKEND")
                        .build();

        given(curationBoxRepository.findBySharingToken("test-token-123456")).willReturn(Optional.of(testBox));
        given(orderRepository.findByCurationBoxId(100L)).willReturn(Optional.of(testPrePaidOrder));
        given(orderRepository.save(any(Order.class))).willAnswer(inv -> inv.getArgument(0));

        // when
        OrderResponse response = orderService.modifyRecipientAddress("test-token-123456", request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getDesiredDeliveryDate()).isEqualTo("WEEKEND");
    }

    @Test
    @DisplayName("선물 수락 시 친환경 에코 패키징 및 공동현관 출입 메모, 알림톡 수신 설정 저장 검증")
    void acceptAndSettleGift_withDeliveryPreferences_savesSuccessfully() {
        // given
        AcceptGiftRequest request = AcceptGiftRequest.builder()
                .receiverName("김수령")
                .receiverPhone("010-9876-5432")
                .shippingAddress("서울특별시 강남구 테헤란로 152 101동 202호")
                .selectedProductId(10L)
                .selectedOption("샌드 화이트")
                .isRecipientAdded(false)
                .ecoFriendlyPackaging(true)
                .entranceMemo("#1234* 문 앞 보관")
                .preDeliveryNotification(true)
                .desiredDeliveryDate("FASTEST")
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
        assertThat(response.getEcoFriendlyPackaging()).isTrue();
        assertThat(response.getEntranceMemo()).isEqualTo("#1234* 문 앞 보관");
        assertThat(response.getPreDeliveryNotification()).isTrue();
        assertThat(response.getDesiredDeliveryDate()).isEqualTo("FASTEST");
    }
}
