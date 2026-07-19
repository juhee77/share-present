package com.sharepresent.domain.curation.repository;

import com.sharepresent.domain.curation.entity.CurationBox;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CurationBoxRepository extends JpaRepository<CurationBox, Long> {
    Optional<CurationBox> findBySharingToken(String sharingToken);
}
