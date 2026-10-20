package com.ams.backend.controller;

import com.ams.backend.entity.*;
import com.ams.backend.repository.*;
import com.ams.backend.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
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
    private final AuditLogService auditLogService;

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceRequest request, HttpServletRequest httpRequest) {
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

        // Security Pipeline: Record tamper-evident audit log
        try {
            String ipAddress = httpRequest.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isBlank()) {
                ipAddress = httpRequest.getRemoteAddr();
            }
            String detailMsg = String.format("Batch attendance marked: %d students, Class: %s (Sem %d-%s), Subject: %s (%s)",
                    recordsToSave.size(),
                    courseClass.getDepartment().getCode(),
                    courseClass.getSemester(),
                    courseClass.getSection(),
                    subject.getName(),
                    subject.getCode());
            auditLogService.logAction(teacher.getUser(), "MARK_ATTENDANCE_BATCH", detailMsg, ipAddress);
        } catch (Exception ignored) {}

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
    public ResponseEntity<?> updateAttendance(@PathVariable Long id, @RequestBody Map<String, String> body, HttpServletRequest httpRequest) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        
        Attendance.AttendanceStatus oldStatus = attendance.getStatus();
        Attendance.AttendanceStatus newStatus = Attendance.AttendanceStatus.valueOf(body.get("status").toUpperCase());
        attendance.setStatus(newStatus);
        attendanceRepository.save(attendance);

        // Security Pipeline: Audit trail for retroactive status overrides
        try {
            String ipAddress = httpRequest.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isBlank()) {
                ipAddress = httpRequest.getRemoteAddr();
            }
            String detailMsg = String.format("Attendance status modified for %s (%s) on %s: %s -> %s",
                    attendance.getStudent().getUser().getName(),
                    attendance.getStudent().getRollNumber(),
                    attendance.getDate().toString(),
                    oldStatus,
                    newStatus);
            auditLogService.logAction(attendance.getTeacher().getUser(), "UPDATE_ATTENDANCE_STATUS", detailMsg, ipAddress);
        } catch (Exception ignored) {}
        
        return ResponseEntity.ok(Map.of("message", "Attendance updated successfully"));
    }
}
