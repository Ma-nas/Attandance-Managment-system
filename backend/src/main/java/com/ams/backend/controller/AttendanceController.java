package com.ams.backend.controller;

import com.ams.backend.entity.*;
import com.ams.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseClassRepository classRepository;
    private final SubjectRepository subjectRepository;

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request) {
        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        CourseClass courseClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        List<Attendance> recordsToSave = new ArrayList<>();

        for (AttendanceRequest.StudentAttendance record : request.getAttendanceRecord()) {
            Student student = studentRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Attendance attendance = Attendance.builder()
                    .student(student)
                    .teacher(teacher)
                    .courseClass(courseClass)
                    .subject(subject)
                    .date(request.getDate())
                    .timeSlot(request.getTimeSlot())
                    .status(Attendance.AttendanceStatus.valueOf(record.getStatus().toUpperCase()))
                    .build();
            
            recordsToSave.add(attendance);
        }

        attendanceRepository.saveAll(recordsToSave);
        return ResponseEntity.ok(Map.of("message", "Attendance marked successfully", "count", recordsToSave.size()));
    }
    @GetMapping("/review")
    public ResponseEntity<?> getAttendanceForReview(
            @RequestParam Long classId,
            @RequestParam String date) {
        
        List<Attendance> records = attendanceRepository.findAll().stream()
                .filter(a -> a.getCourseClass().getId().equals(classId) && a.getDate().toString().equals(date))
                .toList();
                
        return ResponseEntity.ok(records);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        
        attendance.setStatus(Attendance.AttendanceStatus.valueOf(body.get("status").toUpperCase()));
        attendanceRepository.save(attendance);
        
        return ResponseEntity.ok(Map.of("message", "Attendance updated successfully"));
    }
}
