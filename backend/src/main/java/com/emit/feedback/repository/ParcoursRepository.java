package com.emit.feedback.repository;

import com.emit.feedback.entity.Parcours;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcoursRepository extends JpaRepository<Parcours, Long> {
    List<Parcours> findByMentionId(Long mentionId);
}
