package com.emit.feedback.config;

import com.emit.feedback.entity.AcademicYear;
import com.emit.feedback.entity.CourseElement;
import com.emit.feedback.entity.Mention;
import com.emit.feedback.entity.Niveau;
import com.emit.feedback.entity.Parcours;
import com.emit.feedback.entity.Role;
import com.emit.feedback.entity.Semestre;
import com.emit.feedback.entity.Teacher;
import com.emit.feedback.entity.TeachingUnit;
import com.emit.feedback.entity.User;
import com.emit.feedback.entity.enums.NiveauCode;
import com.emit.feedback.entity.enums.RoleName;
import com.emit.feedback.entity.enums.SemestreCode;
import com.emit.feedback.repository.AcademicYearRepository;
import com.emit.feedback.repository.CourseElementRepository;
import com.emit.feedback.repository.MentionRepository;
import com.emit.feedback.repository.NiveauRepository;
import com.emit.feedback.repository.ParcoursRepository;
import com.emit.feedback.repository.RoleRepository;
import com.emit.feedback.repository.SemestreRepository;
import com.emit.feedback.repository.TeacherRepository;
import com.emit.feedback.repository.TeachingUnitRepository;
import com.emit.feedback.repository.UserRepository;
import java.util.Arrays;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final MentionRepository mentionRepository;
    private final ParcoursRepository parcoursRepository;
    private final NiveauRepository niveauRepository;
    private final SemestreRepository semestreRepository;
    private final TeachingUnitRepository teachingUnitRepository;
    private final CourseElementRepository courseElementRepository;
    private final AcademicYearRepository academicYearRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRoles();
        AcademicYear year = seedAcademicYear();
        Teacher teacher = seedTeacher();
        if (mentionRepository.count() == 0) {
            seedAcademicStructure(teacher, year);
        }
    }

    private void seedRoles() {
        Arrays.stream(RoleName.values()).forEach(roleName ->
                roleRepository.findByName(roleName).orElseGet(() -> roleRepository.save(new Role(roleName))));
    }

    private AcademicYear seedAcademicYear() {
        return academicYearRepository.findByCurrentYearTrue().orElseGet(() -> {
            AcademicYear year = new AcademicYear();
            year.setLabel("2025-2026");
            year.setCurrentYear(true);
            return academicYearRepository.save(year);
        });
    }

    private Teacher seedTeacher() {
        Role teacherRole = roleRepository.findByName(RoleName.ENSEIGNANT).orElseThrow();
        User user = userRepository.findByEmail("teacher@emit.mg").orElseGet(() -> {
            User created = new User();
            created.setEmail("teacher@emit.mg");
            created.setPassword(passwordEncoder.encode("password"));
            created.setFullName("Dr. Rakoto");
            created.setRoles(Set.of(teacherRole));
            return userRepository.save(created);
        });
        return teacherRepository.findByUserId(user.getId()).orElseGet(() -> {
            Teacher teacher = new Teacher();
            teacher.setUser(user);
            teacher.setTeacherCode("ENS-001");
            teacher.setDepartment("Informatique");
            return teacherRepository.save(teacher);
        });
    }

    private void seedAcademicStructure(Teacher teacher, AcademicYear academicYear) {
        Mention mention = new Mention();
        mention.setCode("INFO");
        mention.setName("Informatique");
        mention = mentionRepository.save(mention);

        Parcours parcours = new Parcours();
        parcours.setName("Génie Logiciel");
        parcours.setMention(mention);
        parcours = parcoursRepository.save(parcours);

        Niveau niveau = new Niveau();
        niveau.setCode(NiveauCode.L3);
        niveau.setParcours(parcours);
        niveau = niveauRepository.save(niveau);

        Semestre semestre = new Semestre();
        semestre.setCode(SemestreCode.S5);
        semestre.setNiveau(niveau);
        semestre = semestreRepository.save(semestre);

        TeachingUnit ue = new TeachingUnit();
        ue.setCode("UE-INF-501");
        ue.setName("Ingénierie Logicielle");
        ue.setCredits(6);
        ue.setSemestre(semestre);
        ue = teachingUnitRepository.save(ue);

        CourseElement ec1 = new CourseElement();
        ec1.setCode("EC-INF-501A");
        ec1.setName("Programmation Web Avancée");
        ec1.setDescription("Spring Boot, sécurité, API REST.");
        ec1.setHours(36);
        ec1.setTeachingUnit(ue);
        ec1.setTeacher(teacher);
        courseElementRepository.save(ec1);

        CourseElement ec2 = new CourseElement();
        ec2.setCode("EC-INF-501B");
        ec2.setName("Intelligence Artificielle");
        ec2.setDescription("Fondamentaux IA et analyse de données.");
        ec2.setHours(24);
        ec2.setTeachingUnit(ue);
        ec2.setTeacher(teacher);
        courseElementRepository.save(ec2);
    }
}
