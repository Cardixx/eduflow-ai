package com.emit.feedback.repository;

import com.emit.feedback.entity.Feedback;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByCourseElementId(Long courseElementId, Pageable pageable);
    Page<Feedback> findByCourseElementTeacherId(Long teacherId, Pageable pageable);
    List<Feedback> findByCourseElementId(Long courseElementId);

    @Query("select avg(f.rating) from Feedback f where f.courseElement.id = :ecId")
    Double averageRating(@Param("ecId") Long ecId);
}
