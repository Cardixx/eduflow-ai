package com.emit.feedback.service.impl;

import com.emit.feedback.dto.auth.AuthResponse;
import com.emit.feedback.dto.auth.LoginRequest;
import com.emit.feedback.dto.auth.RegisterRequest;
import com.emit.feedback.dto.user.UserDto;
import com.emit.feedback.entity.AcademicYear;
import com.emit.feedback.entity.Niveau;
import com.emit.feedback.entity.Role;
import com.emit.feedback.entity.Student;
import com.emit.feedback.entity.Teacher;
import com.emit.feedback.entity.User;
import com.emit.feedback.entity.enums.RoleName;
import com.emit.feedback.exception.BadRequestException;
import com.emit.feedback.exception.ResourceNotFoundException;
import com.emit.feedback.repository.AcademicYearRepository;
import com.emit.feedback.repository.NiveauRepository;
import com.emit.feedback.repository.RoleRepository;
import com.emit.feedback.repository.StudentRepository;
import com.emit.feedback.repository.TeacherRepository;
import com.emit.feedback.repository.UserRepository;
import com.emit.feedback.security.AppUserDetails;
import com.emit.feedback.security.JwtService;
import com.emit.feedback.service.AuthService;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final NiveauRepository niveauRepository;
    private final AcademicYearRepository academicYearRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already exists");
        }

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setAvatarUrl(request.avatarUrl());
        user.setRoles(Set.of(role));
        User savedUser = userRepository.save(user);

        if (request.role() == RoleName.ETUDIANT) {
            if (request.niveauId() == null || request.studentNumber() == null || request.studentNumber().isBlank()) {
                throw new BadRequestException("Student registration requires niveauId and studentNumber");
            }
            Niveau niveau = niveauRepository.findById(request.niveauId())
                    .orElseThrow(() -> new ResourceNotFoundException("Niveau not found"));
            AcademicYear currentYear = academicYearRepository.findByCurrentYearTrue()
                    .orElseThrow(() -> new ResourceNotFoundException("Current academic year not found"));

            Student student = new Student();
            student.setUser(savedUser);
            student.setStudentNumber(request.studentNumber());
            student.setNiveau(niveau);
            student.setAcademicYear(currentYear);
            studentRepository.save(student);
        }

        if (request.role() == RoleName.ENSEIGNANT) {
            Teacher teacher = new Teacher();
            teacher.setUser(savedUser);
            teacher.setTeacherCode(request.teacherCode() == null || request.teacherCode().isBlank()
                    ? "ENS-" + savedUser.getId()
                    : request.teacherCode());
            teacher.setDepartment("EMIT");
            teacherRepository.save(teacher);
        }

        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        RoleName primaryRole = user.getRoles().stream()
                .map(Role::getName)
                .findFirst()
                .orElse(RoleName.ETUDIANT);
        String token = jwtService.generateToken(new AppUserDetails(user), Map.of("role", primaryRole.name()));
        return new AuthResponse(token, "Bearer", new UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                primaryRole
        ));
    }
}
