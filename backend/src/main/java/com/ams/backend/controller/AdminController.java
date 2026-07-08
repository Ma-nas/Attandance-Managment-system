package com.ams.backend.controller;

import com.ams.backend.repository.StudentRepository;
import com.ams.backend.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();

        return ResponseEntity.ok(Map.of(
            "totalStudents", totalStudents,
            "totalTeachers", totalTeachers,
            "todaysAttendancePercentage", 87, // Mock for now until we build attendance tracking
            "pendingLeaves", 3 // Mock until leave module is implemented
        ));
    }
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> getAllTeachers() {
        return ResponseEntity.ok(teacherRepository.findAll());
    }
}
