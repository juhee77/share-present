package com.sharepresent.domain.curation.entity;

import com.sharepresent.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "curation_boxes")
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CurationBox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(name = "max_budget", nullable = false)
    private Integer maxBudget;

    @Column(name = "message_card", columnDefinition = "TEXT")
    private String messageCard;

    @Column(name = "sharing_token", nullable = false, unique = true)
    private String sharingToken;

    @Builder.Default
    @Column(nullable = false)
    private String status = "CREATED";

    @Builder.Default
    @Column(name = "allow_custom_input", nullable = false)
    private Boolean allowCustomInput = false;

    @Builder.Default
    @OneToMany(mappedBy = "curationBox", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CurationBoxItem> items = new ArrayList<>();

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;
}
