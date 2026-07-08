package com.ams.backend.controller;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AttendanceRequest {
    private Long teacherId;
    private Long classId;
    private Long subjectId;
    private LocalDate date;
    private String timeSlot;
    private List<StudentAttendance> attendanceRecord;

    @Data
    public static class StudentAttendance {
        private Long studentId;
        private String status; // PRESENT, ABSENT, LATE
    }
}
