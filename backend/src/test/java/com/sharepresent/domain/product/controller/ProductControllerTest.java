package com.sharepresent.domain.product.controller;

import com.sharepresent.domain.product.entity.Product;
import com.sharepresent.domain.product.repository.ProductRepository;
import com.sharepresent.domain.product.service.NaverProductSearchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private NaverProductSearchService naverProductSearchService;

    @Test
    @DisplayName("GET /api/v1/products - 예산 범위 및 키워드 필터링 조회 성공")
    void getProducts_withBudgetFilter_success() throws Exception {
        // given
        Product p1 = Product.builder()
                .id(1L)
                .brand("OIMU")
                .name("도자기 머그")
                .price(38000)
                .category("TABLEWARE")
                .build();

        Product p2 = Product.builder()
                .id(2L)
                .brand("LE LABO")
                .name("상탈 33 로션")
                .price(98000)
                .category("HAND_BODY")
                .build();

        given(productRepository.findAll()).willReturn(List.of(p1, p2));

        // when & then
        mockMvc.perform(get("/api/v1/products")
                        .param("minBudget", "30000")
                        .param("maxBudget", "50000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].brand").value("OIMU"))
                .andExpect(jsonPath("$[0].price").value(38000));
    }

    @Test
    @DisplayName("GET /api/v1/products - 카테고리 필터링 조회 성공")
    void getProducts_withCategoryFilter_success() throws Exception {
        // given
        Product p1 = Product.builder()
                .id(1L)
                .brand("GRANHAND")
                .name("사쉐 퍼퓸")
                .price(45000)
                .category("FRAGRANCE")
                .build();

        Product p2 = Product.builder()
                .id(2L)
                .brand("OIMU")
                .name("도자기 머그")
                .price(38000)
                .category("TABLEWARE")
                .build();

        given(productRepository.findAll()).willReturn(List.of(p1, p2));

        // when & then
        mockMvc.perform(get("/api/v1/products")
                        .param("category", "FRAGRANCE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].brand").value("GRANHAND"))
                .andExpect(jsonPath("$[0].category").value("FRAGRANCE"));
    }

    @Test
    @DisplayName("GET /api/v1/products/trending - 실시간 인기 선물 랭킹 조회 성공")
    void getTrendingProducts_success() throws Exception {
        // given
        Product p1 = Product.builder().id(1L).brand("GRANHAND").name("사쉐 퍼퓸").price(45000).build();
        given(productRepository.findAll()).willReturn(List.of(p1));

        // when & then
        mockMvc.perform(get("/api/v1/products/trending"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rank").value(1))
                .andExpect(jsonPath("$[0].brand").value("GRANHAND"));
    }

    @Test
    @DisplayName("GET /api/v1/products - 가격 오름차순(PRICE_ASC) 정렬 조회 성공")
    void getProducts_withPriceAscSort_success() throws Exception {
        // given
        Product p1 = Product.builder().id(1L).brand("B").name("고가 상품").price(100000).build();
        Product p2 = Product.builder().id(2L).brand("A").name("저가 상품").price(20000).build();
        given(productRepository.findAll()).willReturn(List.of(p1, p2));

        // when & then
        mockMvc.perform(get("/api/v1/products")
                        .param("sort", "PRICE_ASC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].price").value(20000))
                .andExpect(jsonPath("$[1].price").value(100000));
    }

    @Test
    @DisplayName("GET /api/v1/products - 가격 내림차순(PRICE_DESC) 정렬 조회 성공")
    void getProducts_withPriceDescSort_success() throws Exception {
        // given
        Product p1 = Product.builder().id(1L).brand("B").name("고가 상품").price(100000).build();
        Product p2 = Product.builder().id(2L).brand("A").name("저가 상품").price(20000).build();
        given(productRepository.findAll()).willReturn(List.of(p1, p2));

        // when & then
        mockMvc.perform(get("/api/v1/products")
                        .param("sort", "PRICE_DESC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].price").value(100000))
                .andExpect(jsonPath("$[1].price").value(20000));
    }
}
