package com.sharepresent.domain.support.controller;

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
    public ResponseEntity<Map<String, Object>> submitInquiry(@RequestBody InquiryRequest request) {
        System.out.println("★ [SupportInquiryController] New 1:1 Customer Support Inquiry Received: " + request.getName());
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "고객님의 문의가 정상적으로 접수되었습니다. 담당자 확인 후 빠르게 답변 드리겠습니다."
        ));
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InquiryRequest {
        private String name;
        private String email;
        private String category;
        private String content;
    }
}
