package com.ams.backend.service;

import com.ams.backend.entity.AuditLog;
import com.ams.backend.entity.User;
import com.ams.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLog logAction(User user, String action, String details, String ipAddress) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .details(details)
                .ipAddress(ipAddress != null && !ipAddress.isBlank() ? ipAddress : "127.0.0.1")
                .timestamp(LocalDateTime.now())
                .build();
        return auditLogRepository.save(auditLog);
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}
