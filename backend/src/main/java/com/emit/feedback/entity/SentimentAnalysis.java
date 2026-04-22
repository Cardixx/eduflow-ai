package com.emit.feedback.entity;

import com.emit.feedback.entity.enums.SentimentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "sentiment_analysis")
public class SentimentAnalysis extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "feedback_id", unique = true)
    private Feedback feedback;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SentimentType sentiment;

    @Column(nullable = false)
    private Double score;

    @Column(nullable = false, length = 1000)
    private String summary;
}
