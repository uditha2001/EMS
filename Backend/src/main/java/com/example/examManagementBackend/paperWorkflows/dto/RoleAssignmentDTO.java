package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleAssignmentDTO {
    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long roleId;
    private String roleName;
    private Long userId;
    private String user;
    private Long examinationId;
    private Boolean isAuthorized;
    private PaperType paperType;
    private LocalDateTime grantAt;

}