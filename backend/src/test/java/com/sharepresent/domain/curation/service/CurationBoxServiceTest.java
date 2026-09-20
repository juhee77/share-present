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

    @Mock
    private com.sharepresent.domain.curation.repository.RollingPaperMessageRepository rollingPaperMessageRepository;

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
                .fontStyle("handwriting")
                .packagingStyle("BOJAGI")
                .sealMonogram("LOVE")
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
        assertThat(response.getFontStyle()).isEqualTo("handwriting");
        assertThat(response.getPackagingStyle()).isEqualTo("BOJAGI");
        assertThat(response.getSealMonogram()).isEqualTo("LOVE");
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

    @Test
    @DisplayName("선물 수령 PIN 번호 검증 - 일치할 경우 true 반환")
    void verifyClaimPin_validPin_returnsTrue() {
        // given
        CurationBox box = CurationBox.builder()
                .id(100L)
                .sharingToken("pin-token-1234")
                .claimPin("1234")
                .minBudget(30000)
                .maxBudget(50000)
                .build();

        given(curationBoxRepository.findBySharingToken("pin-token-1234")).willReturn(Optional.of(box));

        // when
        boolean isValid = curationBoxService.verifyClaimPin("pin-token-1234", "1234");
        boolean isInvalid = curationBoxService.verifyClaimPin("pin-token-1234", "9999");

        // then
        assertThat(isValid).isTrue();
        assertThat(isInvalid).isFalse();
    }

    @Test
    @DisplayName("공동 선물 롤링페이퍼 축하 메시지 등록 - 메시지 및 아바타 스티커 저장 검증")
    void addRollingPaperMessage_success() {
        // given
        CurationBox box = CurationBox.builder()
                .id(100L)
                .sharingToken("rolling-paper-token")
                .minBudget(30000)
                .maxBudget(60000)
                .messageCard("축하해!")
                .rollingPaperMessages(new java.util.ArrayList<>())
                .build();

        com.sharepresent.domain.curation.dto.AddRollingPaperRequest request =
                com.sharepresent.domain.curation.dto.AddRollingPaperRequest.builder()
                        .authorName("마케팅팀 민우")
                        .message("생일 진심으로 축하해! 늘 고마워 🎉")
                        .avatarEmoji("🎉")
                        .build();

        given(curationBoxRepository.findBySharingToken("rolling-paper-token")).willReturn(Optional.of(box));
        given(rollingPaperMessageRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        // when
        CurationBoxResponse response = curationBoxService.addRollingPaperMessage("rolling-paper-token", request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getRollingPaperMessages()).hasSize(1);
        assertThat(response.getRollingPaperMessages().get(0).getAuthorName()).isEqualTo("마케팅팀 민우");
        assertThat(response.getRollingPaperMessages().get(0).getMessage()).isEqualTo("생일 진심으로 축하해! 늘 고마워 🎉");
        assertThat(response.getRollingPaperMessages().get(0).getAvatarEmoji()).isEqualTo("🎉");
    }
}
