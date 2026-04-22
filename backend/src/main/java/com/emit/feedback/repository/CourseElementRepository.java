package com.emit.feedback.repository;

import com.emit.feedback.entity.CourseElement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseElementRepository extends JpaRepository<CourseElement, Long> {
    List<CourseElement> findByTeachingUnitId(Long teachingUnitId);
    List<CourseElement> findByTeacherId(Long teacherId);
}
