package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExaminationRoleAssignmentRevisionDTO {
    private Long examinationId;
    private Long roleAssignmentId;
    private Long previousUserId;
    private Long newUserId;
    private String revisionReason;
    private Long revisedById;
    private LocalDateTime revisedAt;
}
