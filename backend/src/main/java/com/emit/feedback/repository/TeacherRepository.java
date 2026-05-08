package com.emit.feedback.repository;

import com.emit.feedback.entity.Teacher;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);
    Optional<Teacher> findByTeacherCode(String teacherCode);
    boolean existsByTeacherCode(String teacherCode);
}
