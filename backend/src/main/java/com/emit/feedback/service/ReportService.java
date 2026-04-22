package com.emit.feedback.service;

import com.emit.feedback.dto.report.ReportDto;

public interface ReportService {
    ReportDto generateEcReport(Long ecId);
}
