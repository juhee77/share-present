package com.sharepresent.domain.curation.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rolling_paper_messages", indexes = {
    @Index(name = "idx_rpm_curation_box_id", columnList = "curation_box_id")
})
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RollingPaperMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curation_box_id", nullable = false)
    private CurationBox curationBox;

    @Column(name = "author_name", nullable = false, length = 50)
    private String authorName;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    @Column(name = "avatar_emoji", length = 20)
    private String avatarEmoji = "💌";

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
