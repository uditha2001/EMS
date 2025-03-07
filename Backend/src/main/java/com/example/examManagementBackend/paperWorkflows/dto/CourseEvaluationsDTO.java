package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseEvaluationsDTO {
    private Long courseEvaluationId;
    private Long examTypeId;
    private String examTypeName;
    private float passMark;
    private float weightage;
}
