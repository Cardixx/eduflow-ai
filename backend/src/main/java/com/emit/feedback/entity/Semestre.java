package com.emit.feedback.entity;

import com.emit.feedback.entity.enums.SemestreCode;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "semestres")
public class Semestre extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private SemestreCode code;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "niveau_id")
    private Niveau niveau;
}
