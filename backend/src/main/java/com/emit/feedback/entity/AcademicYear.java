package com.emit.feedback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "academic_years")
public class AcademicYear extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String label;

    @Column(nullable = false)
    private boolean currentYear;
}
