package com.emit.feedback.repository;

import com.emit.feedback.entity.TeachingUnit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeachingUnitRepository extends JpaRepository<TeachingUnit, Long> {
    List<TeachingUnit> findBySemestreId(Long semestreId);
    Optional<TeachingUnit> findByCode(String code);
}
