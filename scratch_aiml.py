import json

students = [
    ("23BTRCL126", "ABDUL SAMI"),
    ("23BTRCL256", "DASARI AKHIL"),
    ("23BTRCL041", "DHRITIRAJ LAHAKAR"),
    ("23BTRCL191", "GOOTY KUMMARA SNIGDHA"),
    ("23BTRCL196", "KAJA RESHMI"),
    ("23BTRCL257", "LIKHITH"),
    ("23BTRCL208", "MAGANTI SRAVYA"),
    ("23BTRCL209", "MALLI AKHIL"),
    ("23BTRCL210", "MANAS MISHRA"),
    ("23BTRCL211", "MANGALA JEEVAN SAI"),
    ("23BTRCL008", "MATAM VISWARADHYA"),
    ("23BTRCL214", "MEDAM SURYA JASWANTH"),
    ("23BTRCL151", "MITHUN SANJITH V"),
    ("23BTRCL215", "MOGADALA JNANA SRI HARSH"),
    ("23BTRCL152", "MOHAMMED ISMAIL"),
    ("23BTRCL216", "MOUNIKA C"),
    ("23BTRCL154", "MUHAMMED FIRAS"),
    ("23BTRCL217", "MUKKAMALLA LOKESHWAR REDDY"),
    ("23BTRCL218", "MUTHULURU PRUTHVIRAJ"),
    ("23BTRCL225", "NAMALA USHODAYA"),
    ("23BTRCL226", "NAMALA ZUVARI GNANENDRA"),
    ("23BTRCL227", "P CHETHAN"),
    ("23BTRCL062", "P VASTHAV"),
    ("23BTRCL156", "PRANAV MEHAN"),
    ("23BTRCL260", "PRIYANSHU SONI"),
    ("23BTRCL229", "RATHISH C"),
    ("23BTRCL158", "RISHI KUMAR S NAIR"),
    ("23BTRCL001", "ROHAN KUMAR MANDAL"),
    ("23BTRCL159", "RUHEE ZAINAB")
]

code = """
        Department aimlDept = departmentRepository.findByCode("AIML").orElseGet(() -> 
            departmentRepository.save(Department.builder().name("Artificial Intelligence and Machine Learning").code("AIML").build())
        );

        subjectRepository.findByCode("TECH101").orElseGet(() -> 
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

        String[][] aimlStudents = {
"""

for idx, (usn, name) in enumerate(students):
    code += f'            {{"{usn}", "{usn.lower()}@student.ams.com", "{name}"}}'
    if idx < len(students) - 1:
        code += ",\n"
    else:
        code += "\n"

code += """        };

        for (String[] st : aimlStudents) {
            if (userRepository.findByEmail(st[1]).isEmpty()) {
                User sUser = User.builder()
                        .email(st[1])
                        .password(passwordEncoder.encode("student123"))
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
"""

with open('aiml_seeder.txt', 'w') as f:
    f.write(code)
print("Done")
