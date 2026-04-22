package com.emit.feedback.repository;

import com.emit.feedback.entity.Semestre;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemestreRepository extends JpaRepository<Semestre, Long> {
    List<Semestre> findByNiveauId(Long niveauId);
}
