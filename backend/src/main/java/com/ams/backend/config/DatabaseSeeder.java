package com.ams.backend.config;

import com.ams.backend.entity.*;
import com.ams.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
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
    private final EventRepository eventRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Master Data First
        Department aimlDept = departmentRepository.findByCode("AIML").orElseGet(() -> 
            departmentRepository.save(Department.builder().name("Artificial Intelligence and Machine Learning").code("AIML").build())
        );

        Subject techSubject = subjectRepository.findByCode("TECH101").orElseGet(() -> 
            subjectRepository.save(Subject.builder().name("Technical").code("TECH101").department(aimlDept).defaultSemester(4).build())
        );
        subjectRepository.findByCode("APT101").orElseGet(() -> 
            subjectRepository.save(Subject.builder().name("Aptitude").code("APT101").department(aimlDept).defaultSemester(4).build())
        );
        subjectRepository.findByCode("SS101").orElseGet(() -> 
            subjectRepository.save(Subject.builder().name("Softskills").code("SS101").department(aimlDept).defaultSemester(4).build())
        );

        CourseClass aimlClass = classRepository.findAll().stream()
            .filter(c -> c.getDepartment().getId().equals(aimlDept.getId()) && c.getSemester() == 4 && c.getSection().equals("A"))
            .findFirst()
            .orElseGet(() -> classRepository.save(CourseClass.builder().department(aimlDept).semester(4).section("A").batch("2023-2027").build()));

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
                    .department(aimlDept)
                    .build();
            teacherRepository.save(teacher);
            System.out.println("✅ Seeded test trainer user: trainer@ams.com / trainer123");
        }

        // 29 Students from the screenshot
        String[][] aimlStudents = {
            {"23BTRCL126", "23btrcl126@student.ams.com", "ABDUL SAMI"},
            {"23BTRCL256", "23btrcl256@student.ams.com", "DASARI AKHIL"},
            {"23BTRCL041", "23btrcl041@student.ams.com", "DHRITIRAJ LAHAKAR"},
            {"23BTRCL191", "23btrcl191@student.ams.com", "GOOTY KUMMARA SNIGDHA"},
            {"23BTRCL196", "23btrcl196@student.ams.com", "KAJA RESHMI"},
            {"23BTRCL257", "23btrcl257@student.ams.com", "LIKHITH"},
            {"23BTRCL208", "23btrcl208@student.ams.com", "MAGANTI SRAVYA"},
            {"23BTRCL209", "23btrcl209@student.ams.com", "MALLI AKHIL"},
            {"23BTRCL210", "23btrcl210@student.ams.com", "MANAS MISHRA"},
            {"23BTRCL211", "23btrcl211@student.ams.com", "MANGALA JEEVAN SAI"},
            {"23BTRCL008", "23btrcl008@student.ams.com", "MATAM VISWARADHYA"},
            {"23BTRCL214", "23btrcl214@student.ams.com", "MEDAM SURYA JASWANTH"},
            {"23BTRCL151", "23btrcl151@student.ams.com", "MITHUN SANJITH V"},
            {"23BTRCL215", "23btrcl215@student.ams.com", "MOGADALA JNANA SRI HARSH"},
            {"23BTRCL152", "23btrcl152@student.ams.com", "MOHAMMED ISMAIL"},
            {"23BTRCL216", "23btrcl216@student.ams.com", "MOUNIKA C"},
            {"23BTRCL154", "23btrcl154@student.ams.com", "MUHAMMED FIRAS"},
            {"23BTRCL217", "23btrcl217@student.ams.com", "MUKKAMALLA LOKESHWAR REDDY"},
            {"23BTRCL218", "23btrcl218@student.ams.com", "MUTHULURU PRUTHVIRAJ"},
            {"23BTRCL225", "23btrcl225@student.ams.com", "NAMALA USHODAYA"},
            {"23BTRCL226", "23btrcl226@student.ams.com", "NAMALA ZUVARI GNANENDRA"},
            {"23BTRCL227", "23btrcl227@student.ams.com", "P CHETHAN"},
            {"23BTRCL062", "23btrcl062@student.ams.com", "P VASTHAV"},
            {"23BTRCL156", "23btrcl156@student.ams.com", "PRANAV MEHAN"},
            {"23BTRCL260", "23btrcl260@student.ams.com", "PRIYANSHU SONI"},
            {"23BTRCL229", "23btrcl229@student.ams.com", "RATHISH C"},
            {"23BTRCL158", "23btrcl158@student.ams.com", "RISHI KUMAR S NAIR"},
            {"23BTRCL001", "23btrcl001@student.ams.com", "ROHAN KUMAR MANDAL"},
            {"23BTRCL159", "23btrcl159@student.ams.com", "RUHEE ZAINAB"}
        };

        for (String[] st : aimlStudents) {
            if (userRepository.findByEmail(st[1]).isEmpty()) {
                User sUser = User.builder()
                        .email(st[1])
                        // specific password for Manas Mishra to test easily, others generic
                        .password(passwordEncoder.encode(st[0].equals("23BTRCL210") ? "Mishra_00" : "student123"))
                        .role(Role.STUDENT)
                        .name(st[2])
                        .isActive(true)
                        .build();
                userRepository.save(sUser);

                Student student = Student.builder()
                        .user(sUser)
                        .rollNumber(st[0])
                        .department(aimlDept)
                        .semester("4")
                        .section("A")
                        .build();
                studentRepository.save(student);
            }
        }
        System.out.println("✅ Seeded test student user: 23btrcl210@student.ams.com / Mishra_00");

        // Seed Events
        if (eventRepository.count() == 0) {
            eventRepository.save(Event.builder()
                    .title("Independence Day")
                    .type("National Holiday")
                    .eventDate(java.time.LocalDate.now().plusDays(10))
                    .build());
            eventRepository.save(Event.builder()
                    .title("Mid-Term Exams")
                    .type("Academic")
                    .eventDate(java.time.LocalDate.now().plusDays(25))
                    .build());
            System.out.println("✅ Seeded events");
        }

        // Seed Mock Attendance
        if (attendanceRepository.count() == 0) {
            Teacher teacher = teacherRepository.findAll().stream().findFirst().orElseThrow();
            
            java.time.LocalDate today = java.time.LocalDate.now();
            List<Student> allStudents = studentRepository.findAll();
            
            for (int i = 0; i < allStudents.size(); i++) {
                Student s = allStudents.get(i);
                attendanceRepository.save(Attendance.builder()
                        .student(s)
                        .teacher(teacher)
                        .courseClass(aimlClass)
                        .subject(techSubject)
                        .date(today)
                        .timeSlot("Morning")
                        .status(i % 3 == 0 ? Attendance.AttendanceStatus.ABSENT : Attendance.AttendanceStatus.PRESENT)
                        .build());
            }
            System.out.println("✅ Seeded mock attendance records for today in AIML Class");
        }
    }
}
