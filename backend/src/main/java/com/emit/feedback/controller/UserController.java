package com.emit.feedback.controller;

import com.emit.feedback.dto.user.UserDto;
import com.emit.feedback.entity.Role;
import com.emit.feedback.entity.User;
import com.emit.feedback.entity.enums.RoleName;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.FeedbackRepository;
import com.emit.feedback.repository.MentionRepository;
import com.emit.feedback.repository.UserRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emit.feedback.dto.auth.RegisterRequest;
import com.emit.feedback.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;
    private final CourseElementRepository courseElementRepository;
    private final MentionRepository mentionRepository;
    private final AuthService authService;

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getAvatarUrl(),
                        user.getRoles().stream()
                                .map(Role::getName)
                                .findFirst()
                                .orElse(RoleName.ETUDIANT)
                ))
                .toList();
    }

    @PostMapping("/users")
    public UserDto createUser(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request).user();
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "totalFeedbacks", feedbackRepository.count(),
                "totalEcs", courseElementRepository.count(),
                "totalMentions", mentionRepository.count()
        );
    }
}
