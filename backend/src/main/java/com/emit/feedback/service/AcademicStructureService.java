package com.emit.feedback.service;

import com.emit.feedback.dto.academic.AcademicYearDto;
import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.MentionDto;
import com.emit.feedback.dto.academic.NiveauDto;
import com.emit.feedback.dto.academic.ParcoursDto;
import com.emit.feedback.dto.academic.SemestreDto;
import com.emit.feedback.dto.academic.TeachingUnitDto;
import java.util.List;

public interface AcademicStructureService {
    List<MentionDto> getMentions();
    List<ParcoursDto> getParcoursByMention(Long mentionId);
    List<NiveauDto> getNiveauxByParcours(Long parcoursId);
    List<SemestreDto> getSemestresByNiveau(Long niveauId);
    List<TeachingUnitDto> getTeachingUnitsBySemestre(Long semestreId);
    List<CourseElementDto> getCourseElementsByTeachingUnit(Long ueId);
    List<AcademicYearDto> getAcademicYears();
}
