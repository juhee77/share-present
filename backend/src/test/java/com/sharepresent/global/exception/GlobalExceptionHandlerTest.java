package com.sharepresent.global.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    @DisplayName("IllegalArgumentException 발생 시 400 BAD_REQUEST와 메시지를 반환한다")
    void handleIllegalArgumentException_returnsBadRequest() {
        // given
        IllegalArgumentException ex = new IllegalArgumentException("유효하지 않은 토큰입니다.");

        // when
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalArgumentException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("ERROR");
        assertThat(response.getBody().get("message")).isEqualTo("유효하지 않은 토큰입니다.");
        assertThat(response.getBody().get("timestamp")).isNotNull();
    }

    @Test
    @DisplayName("IllegalStateException 발생 시 409 CONFLICT와 메시지를 반환한다")
    void handleIllegalStateException_returnsConflict() {
        // given
        IllegalStateException ex = new IllegalStateException("이미 완료된 주문입니다.");

        // when
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleIllegalStateException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("ERROR");
        assertThat(response.getBody().get("message")).isEqualTo("이미 완료된 주문입니다.");
    }

    @Test
    @DisplayName("일반 Exception 발생 시 500 INTERNAL_SERVER_ERROR를 반환한다")
    void handleGeneralException_returnsInternalServerError() {
        // given
        Exception ex = new RuntimeException("예상치 못한 DB 오류");

        // when
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleGeneralException(ex);

        // then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo("INTERNAL_SERVER_ERROR");
        assertThat(response.getBody().get("message")).isEqualTo("서버 내부 처리 중 예기치 못한 오류가 발생했습니다.");
    }
}
