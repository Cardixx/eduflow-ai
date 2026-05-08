package com.emit.feedback.config;

import com.emit.feedback.entity.*;
import com.emit.feedback.entity.enums.NiveauCode;
import com.emit.feedback.entity.enums.RoleName;
import com.emit.feedback.entity.enums.SemestreCode;
import com.emit.feedback.entity.enums.SentimentType;
import com.emit.feedback.repository.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final MentionRepository mentionRepository;
    private final ParcoursRepository parcoursRepository;
    private final NiveauRepository niveauRepository;
    private final SemestreRepository semestreRepository;
    private final TeachingUnitRepository teachingUnitRepository;
    private final CourseElementRepository courseElementRepository;
    private final AcademicYearRepository academicYearRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FeedbackRepository feedbackRepository;
    private final SentimentAnalysisRepository sentimentAnalysisRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        seedRoles();
        seedAdmin();
        AcademicYear year = seedAcademicYear();
        
        if (mentionRepository.count() == 0) {
            List<Teacher> teachers = seedTeachers();
            seedAcademicStructure(teachers, year);
            List<Student> students = seedStudents(year);
            seedEnrollmentsAndFeedbacks(students);
        }
    }

    private void seedRoles() {
        Arrays.stream(RoleName.values()).forEach(roleName ->
                roleRepository.findByName(roleName).orElseGet(() -> roleRepository.save(new Role(roleName))));
    }

    private void seedAdmin() {
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElseThrow();
        userRepository.findByEmail("admin@emit.mg").orElseGet(() -> {
            User created = new User();
            created.setEmail("admin@emit.mg");
            created.setPassword(passwordEncoder.encode("admin"));
            created.setFullName("Platform Admin");
            created.setRoles(Set.of(adminRole));
            return userRepository.save(created);
        });
    }

    private AcademicYear seedAcademicYear() {
        return academicYearRepository.findByCurrentYearTrue().orElseGet(() -> {
            AcademicYear year = new AcademicYear();
            year.setLabel("2025-2026");
            year.setCurrentYear(true);
            return academicYearRepository.save(year);
        });
    }

    private List<Teacher> seedTeachers() {
        Role teacherRole = roleRepository.findByName(RoleName.ENSEIGNANT).orElseThrow();
        List<Teacher> teachers = new ArrayList<>();
        
        String[][] teacherData = {
            {"teacher@emit.mg", "Dr. Rakoto", "ENS-001", "Informatique"},
            {"andrian@emit.mg", "Mme. Andrianina", "ENS-002", "Management"},
            {"sahala@emit.mg", "Pr. Sahala", "ENS-003", "Communication"},
            {"faly@emit.mg", "Dr. Faly", "ENS-004", "Informatique"},
            {"tiana@emit.mg", "M. Tiana", "ENS-005", "Mathématiques"}
        };

        for (String[] data : teacherData) {
            final String email = data[0];
            final String name = data[1];
            final String code = data[2];
            final String dept = data[3];

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User created = new User();
                created.setEmail(email);
                created.setPassword(passwordEncoder.encode("password"));
                created.setFullName(name);
                created.setRoles(Set.of(teacherRole));
                return userRepository.save(created);
            });
            
            Teacher teacher = teacherRepository.findByUserId(user.getId()).orElseGet(() -> {
                // Double check teacher code uniqueness
                if (teacherRepository.existsByTeacherCode(code)) {
                    return teacherRepository.findByTeacherCode(code).get();
                }
                Teacher t = new Teacher();
                t.setUser(user);
                t.setTeacherCode(code);
                t.setDepartment(dept);
                return teacherRepository.save(t);
            });
            teachers.add(teacher);
        }
        return teachers;
    }

    private void seedAcademicStructure(List<Teacher> teachers, AcademicYear year) {
        Mention info = createMention("INFO", "Informatique");
        Mention mgmt = createMention("MGT", "Management et Gestion");
        Mention comm = createMention("COM", "Communication Multimédia");

        Parcours gl = createParcours("Génie Logiciel", info);
        Parcours asr = createParcours("Administration Système et Réseau", info);
        Parcours mkt = createParcours("Marketing Digital", mgmt);
        Parcours pub = createParcours("Publicité et Médias", comm);

        for (NiveauCode nc : Arrays.asList(NiveauCode.L1, NiveauCode.L2, NiveauCode.L3)) {
            Niveau niv = createNiveau(nc, gl);
            createSemestre(SemestreCode.valueOf("S" + (nc.ordinal() * 2 + 1)), niv);
            createSemestre(SemestreCode.valueOf("S" + (nc.ordinal() * 2 + 2)), niv);
            
            if (nc == NiveauCode.L3) {
                Semestre s1 = semestreRepository.findAll().stream()
                        .filter(s -> s.getNiveau().getId().equals(niv.getId()) && s.getCode() == SemestreCode.S5)
                        .findFirst().get();
                
                TeachingUnit ue1 = createUE("UE-INF-501", "Ingénierie Logicielle", 6, s1);
                createEC("EC-INF-501A", "Programmation Web Avancée", "Spring Boot et React", 36, ue1, teachers.get(0));
                createEC("EC-INF-501B", "Architecture Microservices", "Docker, K8s, Cloud", 24, ue1, teachers.get(3));

                TeachingUnit ue2 = createUE("UE-INF-502", "Data Science", 4, s1);
                createEC("EC-INF-502A", "Python pour la Data", "NumPy, Pandas", 30, ue2, teachers.get(4));
            }
        }

        Niveau l3mkt = createNiveau(NiveauCode.L3, mkt);
        Semestre s5mkt = createSemestre(SemestreCode.S5, l3mkt);
        TeachingUnit uemkt = createUE("UE-MGT-501", "Stratégie Marketing", 5, s5mkt);
        createEC("EC-MGT-501A", "Analyse de Marché", "Études quantitatives", 20, uemkt, teachers.get(1));
    }

    private List<Student> seedStudents(AcademicYear year) {
        Role studentRole = roleRepository.findByName(RoleName.ETUDIANT).orElseThrow();
        List<Student> students = new ArrayList<>();
        Niveau l3gl = niveauRepository.findAll().stream()
                .filter(n -> n.getCode() == NiveauCode.L3 && n.getParcours().getName().equals("Génie Logiciel"))
                .findFirst().orElseThrow();

        for (int i = 1; i <= 15; i++) {
            final int index = i;
            String email = "student" + index + "@emit.mg";
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User created = new User();
                created.setEmail(email);
                created.setPassword(passwordEncoder.encode("password"));
                created.setFullName("Étudiant " + index);
                created.setRoles(Set.of(studentRole));
                return userRepository.save(created);
            });

            Student student = studentRepository.findByUserId(user.getId()).orElseGet(() -> {
                Student s = new Student();
                s.setUser(user);
                s.setStudentNumber("2024-STD-" + String.format("%03d", index));
                s.setNiveau(l3gl);
                s.setAcademicYear(year);
                return studentRepository.save(s);
            });
            students.add(student);
        }
        return students;
    }

    private void seedEnrollmentsAndFeedbacks(List<Student> students) {
        List<CourseElement> ecs = courseElementRepository.findAll();
        String[] posComments = {
            "Excellent cours, très clair et bien structuré.",
            "Le professeur est passionné et explique très bien les concepts complexes.",
            "Les travaux pratiques sont très formateurs.",
            "J'ai beaucoup appris sur Spring Boot grâce à ce module.",
            "Support de cours de grande qualité."
        };
        String[] neuComments = {
            "Cours correct mais un peu trop rapide sur certains points.",
            "Contenu intéressant mais manque de cas pratiques.",
            "Le rythme est soutenu, il faut s'accrocher.",
            "Bonne base théorique.",
            "Globalement satisfaisant."
        };
        String[] negComments = {
            "Le cours manque d'organisation.",
            "Trop de théorie, pas assez de démonstrations réelles.",
            "Difficulté à suivre les explications techniques.",
            "Volume horaire insuffisant pour couvrir tout le programme.",
            "Les supports de cours sont obsolètes."
        };

        for (Student student : students) {
            for (CourseElement ec : ecs) {
                if (!enrollmentRepository.existsByStudentIdAndCourseElementId(student.getId(), ec.getId())) {
                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourseElement(ec);
                    enrollment.setAcademicYear(student.getAcademicYear());
                    enrollmentRepository.save(enrollment);
                }

                if (random.nextDouble() < 0.8) {
                    Feedback feedback = new Feedback();
                    feedback.setStudent(student);
                    feedback.setCourseElement(ec);
                    feedback.setAnonymous(random.nextBoolean());
                    
                    int sentimentRoll = random.nextInt(100);
                    SentimentType type;
                    String comment;
                    double score;
                    int rating;

                    if (sentimentRoll < 60) {
                        type = SentimentType.POSITIVE;
                        comment = posComments[random.nextInt(posComments.length)];
                        score = 0.7 + (0.3 * random.nextDouble());
                        rating = 4 + random.nextInt(2);
                    } else if (sentimentRoll < 85) {
                        type = SentimentType.NEUTRAL;
                        comment = neuComments[random.nextInt(neuComments.length)];
                        score = 0.4 + (0.2 * random.nextDouble());
                        rating = 3;
                    } else {
                        type = SentimentType.NEGATIVE;
                        comment = negComments[random.nextInt(negComments.length)];
                        score = 0.1 + (0.3 * random.nextDouble());
                        rating = 1 + random.nextInt(2);
                    }

                    feedback.setRating(rating);
                    feedback.setComment(comment);
                    feedback = feedbackRepository.save(feedback);

                    SentimentAnalysis sa = new SentimentAnalysis();
                    sa.setFeedback(feedback);
                    sa.setSentiment(type);
                    sa.setScore(score);
                    sa.setSummary("Analyse automatique du feedback.");
                    sentimentAnalysisRepository.save(sa);
                }
            }
        }
    }

    private Mention createMention(String code, String name) {
        return mentionRepository.findByCode(code).orElseGet(() -> {
            Mention m = new Mention();
            m.setCode(code);
            m.setName(name);
            return mentionRepository.save(m);
        });
    }

    private Parcours createParcours(String name, Mention mention) {
        return parcoursRepository.findAll().stream()
                .filter(p -> p.getName().equals(name) && p.getMention().getId().equals(mention.getId()))
                .findFirst().orElseGet(() -> {
                    Parcours p = new Parcours();
                    p.setName(name);
                    p.setMention(mention);
                    return parcoursRepository.save(p);
                });
    }

    private Niveau createNiveau(NiveauCode code, Parcours parcours) {
        return niveauRepository.findAll().stream()
                .filter(n -> n.getCode() == code && n.getParcours().getId().equals(parcours.getId()))
                .findFirst().orElseGet(() -> {
                    Niveau n = new Niveau();
                    n.setCode(code);
                    n.setParcours(parcours);
                    return niveauRepository.save(n);
                });
    }

    private Semestre createSemestre(SemestreCode code, Niveau niveau) {
        return semestreRepository.findAll().stream()
                .filter(s -> s.getCode() == code && s.getNiveau().getId().equals(niveau.getId()))
                .findFirst().orElseGet(() -> {
                    Semestre s = new Semestre();
                    s.setCode(code);
                    s.setNiveau(niveau);
                    return semestreRepository.save(s);
                });
    }

    private TeachingUnit createUE(String code, String name, Integer credits, Semestre semestre) {
        return teachingUnitRepository.findByCode(code).orElseGet(() -> {
            TeachingUnit ue = new TeachingUnit();
            ue.setCode(code);
            ue.setName(name);
            ue.setCredits(credits);
            ue.setSemestre(semestre);
            return teachingUnitRepository.save(ue);
        });
    }

    private void createEC(String code, String name, String desc, Integer hours, TeachingUnit ue, Teacher teacher) {
        if (!courseElementRepository.existsByCode(code)) {
            CourseElement ec = new CourseElement();
            ec.setCode(code);
            ec.setName(name);
            ec.setDescription(desc);
            ec.setHours(hours);
            ec.setTeachingUnit(ue);
            ec.setTeacher(teacher);
            courseElementRepository.save(ec);
        }
    }
}
