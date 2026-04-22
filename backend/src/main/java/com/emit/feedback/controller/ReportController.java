package com.emit.feedback.controller;

import com.emit.feedback.dto.report.ReportDto;
import com.emit.feedback.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/ec/{ecId}")
    @PreAuthorize("hasAnyRole('ENSEIGNANT','ADMIN')")
    public ReportDto generateEcReport(@PathVariable Long ecId) {
        return reportService.generateEcReport(ecId);
    }
}
