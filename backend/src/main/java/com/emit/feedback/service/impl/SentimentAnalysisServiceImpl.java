package com.emit.feedback.service.impl;

import com.emit.feedback.entity.Feedback;
import com.emit.feedback.entity.SentimentAnalysis;
import com.emit.feedback.entity.enums.SentimentType;
import com.emit.feedback.service.SentimentAnalysisService;
import java.util.Locale;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class SentimentAnalysisServiceImpl implements SentimentAnalysisService {

    private static final Set<String> POSITIVE_KEYWORDS = Set.of("good", "great", "excellent", "clear", "helpful", "super", "bien", "excellent", "genial");
    private static final Set<String> NEGATIVE_KEYWORDS = Set.of("bad", "poor", "confusing", "late", "boring", "nul", "mauvais", "difficile", "problem");

    @Override
    public SentimentAnalysis analyze(Feedback feedback) {
        String normalized = feedback.getComment().toLowerCase(Locale.ROOT);
        long positiveHits = POSITIVE_KEYWORDS.stream().filter(normalized::contains).count();
        long negativeHits = NEGATIVE_KEYWORDS.stream().filter(normalized::contains).count();
        double score = ((feedback.getRating() - 3) * 0.25) + ((positiveHits - negativeHits) * 0.15);

        SentimentType sentiment = SentimentType.NEUTRAL;
        if (score >= 0.35) {
            sentiment = SentimentType.POSITIVE;
        } else if (score <= -0.25) {
            sentiment = SentimentType.NEGATIVE;
        }

        SentimentAnalysis analysis = new SentimentAnalysis();
        analysis.setFeedback(feedback);
        analysis.setSentiment(sentiment);
        analysis.setScore(score);
        analysis.setSummary(buildSummary(feedback, sentiment));
        return analysis;
    }

    private String buildSummary(Feedback feedback, SentimentType sentiment) {
        return switch (sentiment) {
            case POSITIVE -> "Students appreciate this EC for its teaching quality and clarity.";
            case NEGATIVE -> "Students report pain points in this EC that need pedagogical follow-up.";
            case NEUTRAL -> "Feedback is balanced with no dominant positive or negative signal.";
        };
    }
}
