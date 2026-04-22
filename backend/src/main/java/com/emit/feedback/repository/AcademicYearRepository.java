package com.emit.feedback.repository;

import com.emit.feedback.entity.AcademicYear;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByCurrentYearTrue();
}
