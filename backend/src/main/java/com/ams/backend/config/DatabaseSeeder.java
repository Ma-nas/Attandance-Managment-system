package com.ams.backend.config;

import com.ams.backend.entity.*;
import com.ams.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final CourseClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Master Data First
        Department csDept = departmentRepository.findByCode("CS").orElseGet(() -> 
            departmentRepository.save(Department.builder().name("Computer Science").code("CS").build())
        );

        Subject algoSubject = subjectRepository.findByCode("CS201").orElseGet(() -> 
            subjectRepository.save(Subject.builder().name("Algorithms").code("CS201").department(csDept).defaultSemester(4).build())
        );

        CourseClass csClass = classRepository.findAll().stream()
            .filter(c -> c.getDepartment().getId().equals(csDept.getId()) && c.getSemester() == 4 && c.getSection().equals("A"))
            .findFirst()
            .orElseGet(() -> classRepository.save(CourseClass.builder().department(csDept).semester(4).section("A").batch("2023-2027").build()));

        if (userRepository.findByEmail("23BTRCL210@student.ams.com").isEmpty()) {
            User studentUser = User.builder()
                    .email("23BTRCL210@student.ams.com")
                    .password(passwordEncoder.encode("Mishra_00"))
                    .role(Role.STUDENT)
                    .name("Alex Morgan")
                    .isActive(true)
                    .build();
            
            userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .rollNumber("23BTRCL210")
                    .department(csDept)
                    .semester("4")
                    .section("A")
                    .build();
            
            studentRepository.save(student);
            System.out.println("✅ Seeded test student user: 23BTRCL210 / Mishra_00");
        }

        if (userRepository.findByEmail("admin@ams.com").isEmpty()) {
            User adminUser = User.builder()
                    .email("admin@ams.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .name("Super Admin")
                    .isActive(true)
                    .build();
            userRepository.save(adminUser);
            System.out.println("✅ Seeded test admin user: admin@ams.com / admin123");
        }

        if (userRepository.findByEmail("trainer@ams.com").isEmpty()) {
            User trainerUser = User.builder()
                    .email("trainer@ams.com")
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TEACHER)
                    .name("Professor Smith")
                    .isActive(true)
                    .build();
            userRepository.save(trainerUser);

            Teacher teacher = Teacher.builder()
                    .user(trainerUser)
                    .department(csDept)
                    .build();
            teacherRepository.save(teacher);
            System.out.println("✅ Seeded test trainer user: trainer@ams.com / trainer123");
        }
    }
}
