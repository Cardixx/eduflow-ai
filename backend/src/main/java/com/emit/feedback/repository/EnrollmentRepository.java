package com.emit.feedback.repository;

import com.emit.feedback.entity.Enrollment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    boolean existsByStudentIdAndCourseElementId(Long studentId, Long courseElementId);
}
