package com.sharepresent.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminInquiryResponse {
    private Long id;
    private String inquiryCode;
    private String name;
    private String email;
    private String category;
    private String content;
    private String status;
    private String adminReply;
    private LocalDateTime repliedAt;
    private LocalDateTime createdAt;
}
