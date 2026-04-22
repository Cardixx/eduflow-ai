package com.emit.feedback.service;

import com.emit.feedback.entity.Feedback;
import com.emit.feedback.entity.SentimentAnalysis;

public interface SentimentAnalysisService {
    SentimentAnalysis analyze(Feedback feedback);
}
