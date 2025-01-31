package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;

import java.util.List;

@Data
public class TemplateAndStructureDTO {
    private QuestionTemplateDTO template;
    private List<QuestionStructureDTO> questionStructures;
}

