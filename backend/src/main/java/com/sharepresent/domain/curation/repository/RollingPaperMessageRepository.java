package com.sharepresent.domain.curation.repository;

import com.sharepresent.domain.curation.entity.RollingPaperMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RollingPaperMessageRepository extends JpaRepository<RollingPaperMessage, Long> {
    List<RollingPaperMessage> findByCurationBoxIdOrderByCreatedAtAsc(Long curationBoxId);
}
