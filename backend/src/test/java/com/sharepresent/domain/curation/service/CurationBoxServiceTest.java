package com.sharepresent.domain.curation.service;

import com.sharepresent.domain.curation.dto.CreateCurationBoxRequest;
import com.sharepresent.domain.curation.dto.CurationBoxResponse;
import com.sharepresent.domain.curation.entity.CurationBox;
import com.sharepresent.domain.curation.repository.CurationBoxRepository;
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

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CurationBoxServiceTest {

    @Mock
    private CurationBoxRepository curationBoxRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CurationBoxService curationBoxService;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@sharepresent.com")
                .nickname("주희")
                .phoneNumber("010-1234-5678")
                .build();

        testProduct = Product.builder()
                .id(10L)
                .brand("OIMU")
                .name("소락사 샌디 도자기 머그")
                .price(38000)
                .build();
    }

    @Test
    @DisplayName("정상 큐레이션 박스 생성 - Min/Max 이중 예산 및 상품 연동 성공")
    void createCurationBox_success() {
        // given
        CreateCurationBoxRequest request = CreateCurationBoxRequest.builder()
                .senderId(1L)
                .minBudget(30000)
                .maxBudget(60000)
                .messageCard("생일 축하해!")
                .cardTheme("emerald")
                .allowCustomInput(true)
                .productIds(List.of(10L))
                .build();

        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));
        given(productRepository.findById(10L)).willReturn(Optional.of(testProduct));
        given(curationBoxRepository.save(any(CurationBox.class))).willAnswer(invocation -> {
            CurationBox box = invocation.getArgument(0);
            return box.toBuilder().id(100L).build();
        });

        // when
        CurationBoxResponse response = curationBoxService.createCurationBox(request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getMinBudget()).isEqualTo(30000);
        assertThat(response.getMaxBudget()).isEqualTo(60000);
        assertThat(response.getMessageCard()).isEqualTo("생일 축하해!");
        assertThat(response.getCardTheme()).isEqualTo("emerald");
        assertThat(response.getSenderName()).isEqualTo("주희");
        assertThat(response.getSharingToken()).isNotNull().hasSize(16);
    }

    @Test
    @DisplayName("예외 검증 - 최소 예산이 최대 예산보다 큰 경우 IllegalArgumentException 발생")
    void createCurationBox_invalidBudgetRange_throwsException() {
        // given
        CreateCurationBoxRequest request = CreateCurationBoxRequest.builder()
                .senderId(1L)
                .minBudget(70000)
                .maxBudget(50000) // Invalid!
                .messageCard("생일 축하해!")
                .build();

        // when & then
        assertThatThrownBy(() -> curationBoxService.createCurationBox(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("최소 예산이 최대 예산보다 클 수 없습니다.");
    }
}
