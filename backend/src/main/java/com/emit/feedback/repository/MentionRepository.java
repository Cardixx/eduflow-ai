package com.emit.feedback.repository;

import com.emit.feedback.entity.Mention;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MentionRepository extends JpaRepository<Mention, Long> {
    Optional<Mention> findByCode(String code);
}
