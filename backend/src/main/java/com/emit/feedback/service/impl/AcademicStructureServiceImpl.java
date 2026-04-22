package com.emit.feedback.service.impl;

import com.emit.feedback.dto.academic.AcademicYearDto;
import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.MentionDto;
import com.emit.feedback.dto.academic.NiveauDto;
import com.emit.feedback.dto.academic.ParcoursDto;
import com.emit.feedback.dto.academic.SemestreDto;
import com.emit.feedback.dto.academic.TeachingUnitDto;
import com.emit.feedback.repository.AcademicYearRepository;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.MentionRepository;
import com.emit.feedback.repository.NiveauRepository;
import com.emit.feedback.repository.ParcoursRepository;
import com.emit.feedback.repository.SemestreRepository;
import com.emit.feedback.repository.TeachingUnitRepository;
import com.emit.feedback.service.AcademicStructureService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AcademicStructureServiceImpl implements AcademicStructureService {

    private final MentionRepository mentionRepository;
    private final ParcoursRepository parcoursRepository;
    private final NiveauRepository niveauRepository;
    private final SemestreRepository semestreRepository;
    private final TeachingUnitRepository teachingUnitRepository;
    private final CourseElementRepository courseElementRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    public List<MentionDto> getMentions() {
        return mentionRepository.findAll().stream()
                .map(m -> new MentionDto(m.getId(), m.getCode(), m.getName()))
                .toList();
    }

    @Override
    public List<ParcoursDto> getParcoursByMention(Long mentionId) {
        return parcoursRepository.findByMentionId(mentionId).stream()
                .map(p -> new ParcoursDto(p.getId(), p.getName(), p.getMention().getId()))
                .toList();
    }

    @Override
    public List<NiveauDto> getNiveauxByParcours(Long parcoursId) {
        return niveauRepository.findByParcoursId(parcoursId).stream()
                .map(n -> new NiveauDto(n.getId(), n.getCode().name(), n.getParcours().getId()))
                .toList();
    }

    @Override
    public List<SemestreDto> getSemestresByNiveau(Long niveauId) {
        return semestreRepository.findByNiveauId(niveauId).stream()
                .map(s -> new SemestreDto(s.getId(), s.getCode().name(), s.getNiveau().getId()))
                .toList();
    }

    @Override
    public List<TeachingUnitDto> getTeachingUnitsBySemestre(Long semestreId) {
        return teachingUnitRepository.findBySemestreId(semestreId).stream()
                .map(ue -> new TeachingUnitDto(ue.getId(), ue.getCode(), ue.getName(), ue.getCredits(), ue.getSemestre().getId()))
                .toList();
    }

    @Override
    public List<CourseElementDto> getCourseElementsByTeachingUnit(Long ueId) {
        return courseElementRepository.findByTeachingUnitId(ueId).stream()
                .map(ec -> new CourseElementDto(
                        ec.getId(),
                        ec.getCode(),
                        ec.getName(),
                        ec.getDescription(),
                        ec.getHours(),
                        ec.getTeachingUnit().getId(),
                        ec.getTeacher().getId(),
                        ec.getTeacher().getUser().getFullName()
                ))
                .toList();
    }

    @Override
    public List<AcademicYearDto> getAcademicYears() {
        return academicYearRepository.findAll().stream()
                .map(year -> new AcademicYearDto(year.getId(), year.getLabel(), year.isCurrentYear()))
                .toList();
    }
}
