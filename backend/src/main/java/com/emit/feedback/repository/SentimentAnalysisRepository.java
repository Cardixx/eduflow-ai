package com.emit.feedback.repository;

import com.emit.feedback.entity.SentimentAnalysis;
import com.emit.feedback.entity.enums.SentimentType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SentimentAnalysisRepository extends JpaRepository<SentimentAnalysis, Long> {
    Optional<SentimentAnalysis> findByFeedbackId(Long feedbackId);
    List<SentimentAnalysis> findByFeedbackCourseElementId(Long ecId);

    @Query("select count(sa) from SentimentAnalysis sa where sa.feedback.courseElement.id = :ecId and sa.sentiment = :sentiment")
    long countByEcAndSentiment(@Param("ecId") Long ecId, @Param("sentiment") SentimentType sentiment);
}
