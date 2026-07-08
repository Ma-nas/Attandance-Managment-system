package com.ams.backend.controller;

import com.ams.backend.entity.Student;
import com.ams.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    public ResponseEntity<List<Student>> getStudents(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String semester,
            @RequestParam(required = false) String section) {
        
        if (departmentId != null && semester != null && section != null) {
            return ResponseEntity.ok(studentRepository.findByDepartmentIdAndSemesterAndSection(departmentId, semester, section));
        }
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        return ResponseEntity.ok(studentRepository.save(student));
    }
}
