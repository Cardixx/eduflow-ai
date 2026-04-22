package com.emit.feedback.service.impl;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.academic.CourseElementUpsertRequest;
import com.emit.feedback.entity.CourseElement;
import com.emit.feedback.dto.user.TeacherProfileDto;
import com.emit.feedback.entity.Teacher;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.TeacherRepository;
import com.emit.feedback.repository.TeachingUnitRepository;
import com.emit.feedback.service.TeacherService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final SecurityFacade securityFacade;
    private final TeacherRepository teacherRepository;
    private final CourseElementRepository courseElementRepository;
    private final TeachingUnitRepository teachingUnitRepository;

    @Override
    @Transactional(readOnly = true)
    public TeacherProfileDto getCurrentTeacherProfile() {
        Teacher teacher = currentTeacher();
        return new TeacherProfileDto(
                teacher.getId(),
                teacher.getTeacherCode(),
                teacher.getUser().getFullName(),
                teacher.getUser().getEmail(),
                teacher.getDepartment()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseElementDto> getMyCourses() {
        return courseElementRepository.findByTeacherId(currentTeacher().getId()).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public CourseElementDto createCourseElement(CourseElementUpsertRequest request) {
        Teacher teacher = currentTeacher();
        CourseElement ec = new CourseElement();
        ec.setCode(request.code());
        ec.setName(request.name());
        ec.setDescription(request.description());
        ec.setHours(request.hours());
        ec.setTeachingUnit(teachingUnitRepository.findById(request.ueId())
                .orElseThrow(() -> new ResourceNotFoundException("UE not found")));
        ec.setTeacher(teacher);
        return toDto(courseElementRepository.save(ec));
    }

    @Override
    @Transactional
    public CourseElementDto updateCourseElement(Long ecId, CourseElementUpsertRequest request) {
        Teacher teacher = currentTeacher();
        CourseElement ec = courseElementRepository.findById(ecId)
                .orElseThrow(() -> new ResourceNotFoundException("EC not found"));
        if (!ec.getTeacher().getId().equals(teacher.getId())) {
            throw new ResourceNotFoundException("EC not found");
        }
        ec.setCode(request.code());
        ec.setName(request.name());
        ec.setDescription(request.description());
        ec.setHours(request.hours());
        ec.setTeachingUnit(teachingUnitRepository.findById(request.ueId())
                .orElseThrow(() -> new ResourceNotFoundException("UE not found")));
        return toDto(courseElementRepository.save(ec));
    }

    private Teacher currentTeacher() {
        return teacherRepository.findByUserId(securityFacade.currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
    }

    private CourseElementDto toDto(CourseElement ec) {
        return new CourseElementDto(
                ec.getId(),
                ec.getCode(),
                ec.getName(),
                ec.getDescription(),
                ec.getHours(),
                ec.getTeachingUnit().getId(),
                ec.getTeacher().getId(),
                ec.getTeacher().getUser().getFullName()
        );
    }
}
