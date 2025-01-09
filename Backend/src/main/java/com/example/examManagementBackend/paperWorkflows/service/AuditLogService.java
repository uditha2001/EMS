package com.example.examManagementBackend.paperWorkflows.service;


import com.example.examManagementBackend.paperWorkflows.entity.AuditLog;
import com.example.examManagementBackend.paperWorkflows.entity.Question;
import com.example.examManagementBackend.paperWorkflows.repository.AuditLogRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logChange(Question question, UserEntity moderator, String changeType, String oldValue, String newValue) {
        AuditLog log = new AuditLog();
        log.setQuestion(question);
        log.setModerator(moderator);
        log.setChangeType(changeType);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);
        auditLogRepository.save(log);
    }
}

