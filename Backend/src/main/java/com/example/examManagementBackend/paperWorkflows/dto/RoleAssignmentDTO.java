package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleAssignmentDTO {
    private Long id;
    private Long courseId;
    private Long roleId;
    private Long userId;
    private Long examinationId;
    private Boolean isAuthorized;
}