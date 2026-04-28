package com.emit.feedback.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "feedbacks")
public class Feedback extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ec_id")
    private CourseElement courseElement;

    @Column(nullable = false)
    private Integer rating;

    @Column(nullable = false, length = 4000)
    private String comment;

    @Column(nullable = false)
    private boolean anonymous;

    @OneToOne(mappedBy = "feedback", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private SentimentAnalysis sentimentAnalysis;
}
