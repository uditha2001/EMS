package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;

@Data
public class RoleAssignmentRevisionRequestDTO {
    private Long roleAssignmentId;
    private Long newUserId;
    private Long revisedById;
    private String revisionReason;
}
