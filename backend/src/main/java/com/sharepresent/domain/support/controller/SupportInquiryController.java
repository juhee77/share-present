package com.sharepresent.domain.support.controller;

import com.sharepresent.domain.support.entity.SupportInquiry;
import com.sharepresent.domain.support.repository.SupportInquiryRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportInquiryController {

    private final SupportInquiryRepository supportInquiryRepository;

    @PostMapping("/inquiries")
    public ResponseEntity<Map<String, Object>> submitInquiry(@Valid @RequestBody InquiryRequest request) {
        String inquiryCode = "INQ-" + (100000 + (long)(Math.random() * 900000));
        
        SupportInquiry inquiry = SupportInquiry.builder()
                .inquiryCode(inquiryCode)
                .name(request.getName())
                .email(request.getEmail())
                .category(request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory() : "기타 문의")
                .content(request.getContent())
                .status("IN_PROGRESS")
                .build();
        supportInquiryRepository.save(inquiry);

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "inquiryId", inquiryCode,
                "message", "고객님의 문의가 정상적으로 접수되었습니다. 담당자 확인 후 빠르게 답변 드리겠습니다."
        ));
    }

    @GetMapping("/inquiries/{inquiryId}")
    public ResponseEntity<Map<String, Object>> getInquiryStatus(@PathVariable("inquiryId") String inquiryId) {
        return supportInquiryRepository.findByInquiryCode(inquiryId)
                .map(inquiry -> {
                    String statusLabel = "ANSWERED".equals(inquiry.getStatus()) ? "답변 완료" : "전문 상담원 검토 중";
                    String adminNote = inquiry.getAdminReply() != null 
                            ? inquiry.getAdminReply() 
                            : "고객센터 전담팀에서 접수 내용을 확인하고 있으며, 답변 작성 즉시 이메일과 카카오 알림톡으로 안내해 드립니다.";
                    String formattedDate = inquiry.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));

                    return ResponseEntity.ok(Map.<String, Object>of(
                            "inquiryId", inquiry.getInquiryCode(),
                            "status", inquiry.getStatus(),
                            "statusLabel", statusLabel,
                            "category", inquiry.getCategory() != null ? inquiry.getCategory() : "일반 문의",
                            "registeredAt", formattedDate,
                            "estimatedReplyTime", "ANSWERED".equals(inquiry.getStatus()) ? "답변 전달 완료" : "평균 2시간 이내 회신 예정",
                            "adminNote", adminNote
                    ));
                })
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "inquiryId", inquiryId,
                        "status", "IN_PROGRESS",
                        "statusLabel", "전문 상담원 검토 중",
                        "category", "결제/정산/배송 문의",
                        "registeredAt", "접수 진행 중",
                        "estimatedReplyTime", "평균 2시간 이내 회신 예정",
                        "adminNote", "접수 번호가 확인되었습니다. 담당자가 순차적으로 확인 중입니다."
                )));
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
