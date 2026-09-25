package com.sharepresent.domain.support.repository;

import com.sharepresent.domain.support.entity.SupportInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SupportInquiryRepository extends JpaRepository<SupportInquiry, Long> {
    Optional<SupportInquiry> findByInquiryCode(String inquiryCode);
    List<SupportInquiry> findAllByOrderByCreatedAtDesc();
}
