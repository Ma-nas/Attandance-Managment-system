package com.ams.backend.service;

import com.ams.backend.entity.AuditLog;
import com.ams.backend.entity.Role;
import com.ams.backend.entity.User;
import com.ams.backend.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogService auditLogService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("admin@ams.com")
                .name("Super Admin")
                .role(Role.ADMIN)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully record audit log with valid IP address")
    void testLogActionWithExplicitIp() {
        AuditLog mockSavedLog = AuditLog.builder()
                .id(100L)
                .user(sampleUser)
                .action("MARK_ATTENDANCE_BATCH")
                .details("Batch of 25 records submitted")
                .ipAddress("192.168.1.105")
                .timestamp(LocalDateTime.now())
                .build();

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(mockSavedLog);

        AuditLog result = auditLogService.logAction(
                sampleUser,
                "MARK_ATTENDANCE_BATCH",
                "Batch of 25 records submitted",
                "192.168.1.105"
        );

        assertNotNull(result);
        assertEquals("MARK_ATTENDANCE_BATCH", result.getAction());
        assertEquals("192.168.1.105", result.getIpAddress());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("Should fallback to localhost IP when incoming IP is null or blank")
    void testLogActionWithFallbackIp() {
        AuditLog mockSavedLog = AuditLog.builder()
                .id(101L)
                .user(sampleUser)
                .action("UPDATE_ATTENDANCE_STATUS")
                .details("Status modified to PRESENT")
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now())
                .build();

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(mockSavedLog);

        AuditLog result = auditLogService.logAction(
                sampleUser,
                "UPDATE_ATTENDANCE_STATUS",
                "Status modified to PRESENT",
                ""
        );

        assertNotNull(result);
        assertEquals("127.0.0.1", result.getIpAddress());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("Should retrieve top recent audit logs")
    void testGetRecentAuditLogs() {
        AuditLog log1 = AuditLog.builder().id(1L).action("A1").ipAddress("127.0.0.1").build();
        AuditLog log2 = AuditLog.builder().id(2L).action("A2").ipAddress("127.0.0.1").build();

        when(auditLogRepository.findTop50ByOrderByTimestampDesc()).thenReturn(List.of(log1, log2));

        List<AuditLog> logs = auditLogService.getRecentAuditLogs();

        assertEquals(2, logs.size());
        verify(auditLogRepository, times(1)).findTop50ByOrderByTimestampDesc();
    }
}