package com.emit.feedback.controller;

import com.emit.feedback.dto.academic.AcademicYearDto;
import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.MentionDto;
import com.emit.feedback.dto.academic.NiveauDto;
import com.emit.feedback.dto.academic.ParcoursDto;
import com.emit.feedback.dto.academic.SemestreDto;
import com.emit.feedback.dto.academic.TeachingUnitDto;
import com.emit.feedback.service.AcademicStructureService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emit.feedback.repository.CourseElementRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/academic")
@RequiredArgsConstructor
public class AcademicController {

    private final AcademicStructureService academicStructureService;
    private final CourseElementRepository courseElementRepository;

    @GetMapping("/mentions")
    public List<MentionDto> getMentions() {
        return academicStructureService.getMentions();
    }

    @DeleteMapping("/ecs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEc(@PathVariable Long id) {
        courseElementRepository.deleteById(id);
    }

    @GetMapping("/mentions/{mentionId}/parcours")
    public List<ParcoursDto> getParcours(@PathVariable Long mentionId) {
        return academicStructureService.getParcoursByMention(mentionId);
    }

    @GetMapping("/parcours/{parcoursId}/niveaux")
    public List<NiveauDto> getNiveaux(@PathVariable Long parcoursId) {
        return academicStructureService.getNiveauxByParcours(parcoursId);
    }

    @GetMapping("/niveaux/{niveauId}/semestres")
    public List<SemestreDto> getSemestres(@PathVariable Long niveauId) {
        return academicStructureService.getSemestresByNiveau(niveauId);
    }

    @GetMapping("/semestres/{semestreId}/ues")
    public List<TeachingUnitDto> getTeachingUnits(@PathVariable Long semestreId) {
        return academicStructureService.getTeachingUnitsBySemestre(semestreId);
    }

    @GetMapping("/ues/{ueId}/ecs")
    public List<CourseElementDto> getCourseElements(@PathVariable Long ueId) {
        return academicStructureService.getCourseElementsByTeachingUnit(ueId);
    }

    @GetMapping("/academic-years")
    public List<AcademicYearDto> getAcademicYears() {
        return academicStructureService.getAcademicYears();
    }
}
