package com.sharepresent.domain.product.service;

import com.sharepresent.domain.product.entity.Product;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class NaverProductSearchServiceTest {

    private NaverProductSearchService naverProductSearchService;

    @BeforeEach
    void setUp() {
        naverProductSearchService = new NaverProductSearchService();
    }

    @Test
    @DisplayName("null 또는 빈 문자열 검색 시 빈 리스트를 반환한다")
    void searchProducts_blankQuery_returnsEmptyList() {
        assertThat(naverProductSearchService.searchProducts(null)).isEmpty();
        assertThat(naverProductSearchService.searchProducts("")).isEmpty();
        assertThat(naverProductSearchService.searchProducts("   ")).isEmpty();
    }

    @Test
    @DisplayName("'이솝' 또는 'aesop' 검색 시 이솝 핸드밤, 세럼, 향수 등 대표 상품 목록을 반환한다")
    void searchProducts_aesopBrand_returnsAesopProducts() {
        // when
        List<Product> resultsKorean = naverProductSearchService.searchProducts("이솝 핸드크림");
        List<Product> resultsEnglish = naverProductSearchService.searchProducts("aesop");

        // then
        assertThat(resultsKorean).isNotEmpty();
        assertThat(resultsKorean.get(0).getBrand()).isEqualTo("AESOP");
        assertThat(resultsKorean).anyMatch(p -> p.getName().contains("레저렉션 아로마틱 핸드 밤"));

        assertThat(resultsEnglish).isNotEmpty();
        assertThat(resultsEnglish.get(0).getBrand()).isEqualTo("AESOP");
    }

    @Test
    @DisplayName("'탬버린즈' 검색 시 탬버린즈 시그니처 상품 목록을 반환한다")
    void searchProducts_tamburinsBrand_returnsTamburinsProducts() {
        // when
        List<Product> results = naverProductSearchService.searchProducts("탬버린즈 카모");

        // then
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getBrand()).isEqualTo("TAMBURINS");
        assertThat(results).anyMatch(p -> p.getName().contains("CHAMO"));
    }

    @Test
    @DisplayName("'스탠리' 또는 'stanley' 검색 시 스탠리 텀블러 목록을 반환한다")
    void searchProducts_stanleyBrand_returnsStanleyProducts() {
        // when
        List<Product> results = naverProductSearchService.searchProducts("스탠리 텀블러");

        // then
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getBrand()).isEqualTo("STANLEY");
    }

    @Test
    @DisplayName("등록되지 않은 일반 키워드 검색 시 큐레이션 폴백 상품 리스트를 생성하여 반환한다")
    void searchProducts_unknownQuery_returnsCuratedFallback() {
        // when
        List<Product> results = naverProductSearchService.searchProducts("빈티지 스탠드 조명");

        // then
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getName()).contains("빈티지 스탠드 조명");
    }
}
