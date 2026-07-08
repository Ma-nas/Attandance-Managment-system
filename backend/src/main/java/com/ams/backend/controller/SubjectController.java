package com.ams.backend.controller;

import com.ams.backend.entity.Subject;
import com.ams.backend.repository.DepartmentRepository;
import com.ams.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        // Ensure department exists
        if (subject.getDepartment() != null && subject.getDepartment().getId() != null) {
            subject.setDepartment(departmentRepository.findById(subject.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found")));
        }
        return ResponseEntity.ok(subjectRepository.save(subject));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
