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
                    .build(),
                Product.builder()
                    .brand("TAMBURINS")
                    .name("퍼퓸 핸드크림 CHAMO (30ml)")
                    .price(32000)
                    .description("진득한 카모마일의 약초 향과 따스한 우디 가드의 부드러움이 감도는 탬버린즈 시그니처 핸드크림.")
                    .icon("cream")
                    .options(List.of("CHAMO", "BERGA SANDAL", "LALE"))
                    .build(),
                Product.builder()
                    .brand("AESOP")
                    .name("레저렉션 아로마틱 핸드 밤 (75ml)")
                    .price(39000)
                    .description("지친 손에 유분기 없는 풍부한 수분감을 공급하는 이솝의 아이코닉 시트러스 우디 핸드밤.")
                    .icon("balm")
                    .build(),
                Product.builder()
                    .brand("DIPTYQUE")
                    .name("미니 센티드 캔들 베이 (70g)")
                    .price(68000)
                    .description("장미 꽃다발의 향과 블랙커런트 잎의 싱그러운 도회적 노트가 조화로운 딥티크 시그니처 캔들.")
                    .icon("candle")
                    .options(List.of("베이(Baies)", "장미(Roses)", "피기에(Figuier)"))
                    .build(),
                Product.builder()
                    .brand("SABRE")
                    .name("비스트로 디너 카트러리 2인 세트")
                    .price(46000)
                    .description("파리 카페의 감성을 담아낸 컬러풀하고 세련된 프랑스 프리미엄 카트러리 세트.")
                    .icon("cutlery")
                    .options(List.of("아이보리", "티크", "타코이즈"))
                    .build(),
                Product.builder()
                    .brand("KINTO")
                    .name("데이오프 텀블러 (500ml)")
                    .price(42000)
                    .description("부드러운 손잡이와 은은한 파스텔 톤 코팅으로 일상 속 휴식을 선사하는 킨토 스테인리스 텀블러.")
                    .icon("tumbler")
                    .options(List.of("무스타치 화이트", "페일 블루", "카키"))
                    .build(),
                Product.builder()
                    .brand("LE LABO")
                    .name("상탈 33 바디 로션 (237ml)")
                    .price(98000)
                    .description("스모키한 피망과 카드멈, 바이올렛 향이 아우러져 개성을 완성하는 르라보의 클래식 로션.")
                    .icon("lotion")
                    .build(),
                Product.builder()
                    .brand("MAISON MARGIELA")
                    .name("레이지 선데이 모닝 디퓨저 (185ml)")
                    .price(118000)
                    .description("깨끗하게 세탁된 갓 다린 리넨 이불에서 느껴지는 포근하고 부드러운 화이트 머스크 향.")
                    .icon("diffuser")
                    .build(),
                Product.builder()
                    .brand("HAY")
                    .name("클리어 그래픽 유리컵 & 트레이 세트")
                    .price(54000)
                    .description("덴마크 북유럽 감성의 덴마크 HAY 그래픽 기하학 패턴 테이블웨어 세트.")
                    .icon("tray")
                    .options(List.of("옐로우 트레이", "그린 트레이"))
                    .build(),
                Product.builder()
                    .brand("SANTA MARIA NOVELLA")
                    .name("프리지아 고체 향수 왁스 태블릿")
                    .price(58000)
                    .description("피렌체 전통 제조법으로 꽃잎을 굳혀 옷장과 드레스룸을 고급스러운 프리지아 향으로 채워주는 왁스.")
                    .icon("wax")
                    .build(),
                Product.builder()
                    .brand("BANG & OLUFSEN")
                    .name("베오사운드 A1 2nd Gen 포터블 스피커")
                    .price(145000)
                    .description("덴마크 뱅앤올룹슨의 명품 방수 블루투스 스피커. 아노다이징 알루미늄 돔 케이싱.")
                    .icon("speaker")
                    .options(List.of("블랙 앤트러사이트", "샤방 핑크", "골드 톤"))
                    .build()
            );

            productRepository.saveAll(defaultProducts);
            System.out.println("★ [DataInitializer] 16 premium luxury products initialized in database.");
        }
    }
}
