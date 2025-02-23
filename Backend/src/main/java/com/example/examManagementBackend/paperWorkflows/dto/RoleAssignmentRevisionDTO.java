package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleAssignmentRevisionDTO {
    private Long roleAssignmentId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String paperType;
    private String role;
    private String previousUser;
    private String newUser;
    private String revisionReason;
    private String revisedBy;
    private String revisedAt;
}
