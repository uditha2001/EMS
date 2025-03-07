package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleAssignmentDTO {
    private Long courseId;
    private Long roleId;
    private Long userId;
    private Long examinationId;
    private Boolean isAuthorized;
    private PaperType paperType;
}
