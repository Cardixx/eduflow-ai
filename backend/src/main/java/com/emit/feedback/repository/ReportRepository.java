package com.emit.feedback.repository;

import com.emit.feedback.entity.Report;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReferenceCode(String referenceCode);
}
