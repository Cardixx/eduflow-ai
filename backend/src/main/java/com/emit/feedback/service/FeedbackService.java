package com.emit.feedback.service;

import com.emit.feedback.dto.common.PageResponse;
import com.emit.feedback.dto.feedback.FeedbackDto;
import com.emit.feedback.dto.feedback.FeedbackRequest;

public interface FeedbackService {
    FeedbackDto submitFeedback(FeedbackRequest request);
    PageResponse<FeedbackDto> getFeedbackByEc(Long ecId, int page, int size);
    PageResponse<FeedbackDto> getFeedbackForCurrentTeacher(int page, int size);
    PageResponse<FeedbackDto> getFeedbackForCurrentStudent(int page, int size);
}
