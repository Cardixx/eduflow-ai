package com.emit.feedback.repository;

import com.emit.feedback.entity.Niveau;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NiveauRepository extends JpaRepository<Niveau, Long> {
    List<Niveau> findByParcoursId(Long parcoursId);
}
