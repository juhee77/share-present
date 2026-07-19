package com.sharepresent.global.initializer;

import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.user.entity.User;
import com.sharepresent.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize default sender user (주희)
        if (userRepository.count() == 0) {
            User defaultSender = User.builder()
                    .email("juhee@sharepresent.com")
                    .nickname("주희")
                    .phoneNumber("010-9876-5432")
                    .build();
            userRepository.save(defaultSender);
            System.out.println("★ [DataInitializer] Default sender '주희' has been initialized.");
        }

        // 2. Initialize default premium products matching index.html catalog
        if (productRepository.count() == 0) {
            List<Product> defaultProducts = List.of(
                Product.builder()
                    .brand("OIMU")
                    .name("소락사 샌디 도자기 머그")
                    .price(38000)
                    .description("설악산의 모래 질감을 담아낸 아늑하고 미니멀한 핸드메이드 도자기 컵 세트입니다.")
                    .icon("mug")
                    .options(List.of("샌드 화이트", "클레이 브라운"))
                    .build(),
                Product.builder()
                    .brand("GRANHAND")
                    .name("마린 오크모스 사쉐 퍼퓸")
                    .price(45000)
                    .description("차분하고 내추럴한 나무와 풀 향으로 방 안을 가득 채우는 섬세한 패브릭 사쉐 퍼퓸입니다.")
                    .icon("perfume")
                    .options(List.of("규장", "마린", "수지발삼"))
                    .build(),
                Product.builder()
                    .brand("NONFICTION")
                    .name("젠틀나잇 핸드워시 (300ml)")
                    .price(32000)
                    .description("달콤한 스웨이드와 시더우드 향이 어우러져 매일의 일상을 특별하게 해주는 핸드케어.")
                    .icon("wash")
                    .build(),
                Product.builder()
                    .brand("CROWCANYON")
                    .name("머그 & 플레이트 세트")
                    .price(48000)
                    .description("마블 패턴으로 주방의 감도를 한 단계 올려주는 빈티지 테이블웨어 세트입니다.")
                    .icon("plate")
                    .options(List.of("블랙 마블", "핑크 마블", "베이비 블루 마블"))
                    .build(),
                Product.builder()
                    .brand("HUXLEY")
                    .name("바디 케어 워시 & 로션 듀오")
                    .price(52000)
                    .description("선인장 시드 오일이 선사하는 깊은 보습과 시그니처 모로칸 정원 향의 바디 세트.")
                    .icon("wash")
                    .build(),
                Product.builder()
                    .brand("SOHPE")
                    .name("아로마 오일 센티드 홈 캔들")
                    .price(41000)
                    .description("천연 에센셜 오일 블렌딩으로 심신을 안정시키고 평온한 무드를 제안하는 홈 캔들.")
                    .icon("candle")
                    .options(List.of("유칼립투스 라벤더", "패츌리 샌달우드"))
                    .build()
            );

            productRepository.saveAll(defaultProducts);
            System.out.println("★ [DataInitializer] 6 premium products initialized in database.");
        }
    }
}
