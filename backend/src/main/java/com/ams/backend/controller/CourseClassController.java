package com.ams.backend.controller;

import com.ams.backend.entity.CourseClass;
import com.ams.backend.repository.CourseClassRepository;
import com.ams.backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class CourseClassController {

    private final CourseClassRepository classRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<CourseClass>> getAllClasses() {
        return ResponseEntity.ok(classRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<CourseClass> createClass(@RequestBody CourseClass courseClass) {
        if (courseClass.getDepartment() != null && courseClass.getDepartment().getId() != null) {
            courseClass.setDepartment(departmentRepository.findById(courseClass.getDepartment().getId())
                    .orElseThrow(() -> new RuntimeException("Department not found")));
        }
        return ResponseEntity.ok(classRepository.save(courseClass));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
