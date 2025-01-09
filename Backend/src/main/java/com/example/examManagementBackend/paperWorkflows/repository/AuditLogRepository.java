package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}