package com.sharepresent.domain.support.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/support")
@CrossOrigin(origins = "*")
public class SupportInquiryController {

    @PostMapping("/inquiries")
    public ResponseEntity<Map<String, Object>> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        String inquiryId = "INQ-" + (System.currentTimeMillis() % 1000000);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "inquiryId", inquiryId,
                "message", "고객님의 문의가 정상적으로 접수되었습니다. 담당자 확인 후 빠르게 답변 드리겠습니다."
        ));
    }

    @GetMapping("/inquiries/{inquiryId}")
    public ResponseEntity<Map<String, Object>> getInquiryStatus(@PathVariable("inquiryId") String inquiryId) {
        return ResponseEntity.ok(Map.of(
                "inquiryId", inquiryId,
                "status", "IN_PROGRESS",
                "statusLabel", "전문 상담원 검토 중",
                "category", "결제/정산/배송 문의",
                "registeredAt", "2026.09.20",
                "estimatedReplyTime", "평균 2시간 이내 회신 예정",
                "adminNote", "고객센터 전담팀에서 접수 내용을 확인하고 있으며, 답변 작성 즉시 이메일과 카카오 알림톡으로 안내해 드립니다."
        ));
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InquiryRequest {
        @NotBlank(message = "이름은 필수 입력입니다.")
        private String name;

        @NotBlank(message = "이메일은 필수 입력입니다.")
        @Email(message = "올바른 이메일 형식이어야 합니다.")
        private String email;

        private String category;

        @NotBlank(message = "문의 내용은 필수 입력입니다.")
        private String content;
    }
}

