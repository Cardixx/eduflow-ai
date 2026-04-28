package com.emit.feedback.service.impl;

import com.emit.feedback.dto.academic.CourseElementDto;
import com.emit.feedback.dto.user.StudentProfileDto;
import com.emit.feedback.entity.AcademicYear;
import com.emit.feedback.entity.CourseElement;
import com.emit.feedback.entity.Enrollment;
import com.emit.feedback.entity.Student;
import com.emit.feedback.exception.BadRequestException;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.AcademicYearRepository;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.EnrollmentRepository;
import com.emit.feedback.repository.StudentRepository;
import com.emit.feedback.service.StudentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final SecurityFacade securityFacade;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseElementRepository courseElementRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentProfileDto getCurrentStudentProfile() {
        Student student = currentStudent();
        return new StudentProfileDto(
                student.getId(),
                student.getStudentNumber(),
                student.getUser().getFullName(),
                student.getUser().getEmail(),
                student.getNiveau().getCode().name(),
                student.getAcademicYear().getLabel()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseElementDto> getMyCourses() {
        return enrollmentRepository.findByStudentId(currentStudent().getId()).stream()
                .map(Enrollment::getCourseElement)
                .map(this::toCourseElementDto)
                .toList();
    }

    @Override
    @Transactional
    public void enrollCurrentStudent(Long ecId) {
        Student student = currentStudent();
        if (enrollmentRepository.existsByStudentIdAndCourseElementId(student.getId(), ecId)) {
            throw new BadRequestException("Student already enrolled in this EC");
        }
        CourseElement ec = courseElementRepository.findById(ecId)
                .orElseThrow(() -> new ResourceNotFoundException("EC not found"));
        AcademicYear currentYear = academicYearRepository.findByCurrentYearTrue()
                .orElseThrow(() -> new ResourceNotFoundException("Current academic year not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourseElement(ec);
        enrollment.setAcademicYear(currentYear);
        enrollmentRepository.save(enrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseElementDto> getAvailableCoursesForEnrollment() {
        Student student = currentStudent();
        List<Long> enrolledEcIds = enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(e -> e.getCourseElement().getId())
                .toList();
        return courseElementRepository.findAll().stream()
                .filter(ec -> !enrolledEcIds.contains(ec.getId()))
                .map(this::toCourseElementDto)
                .toList();
    }

    private Student currentStudent() {
        return studentRepository.findByUserId(securityFacade.currentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
    }

    private CourseElementDto toCourseElementDto(CourseElement ec) {
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
