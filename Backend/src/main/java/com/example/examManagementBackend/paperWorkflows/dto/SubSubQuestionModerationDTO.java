package com.example.examManagementBackend.paperWorkflows.dto;


import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import lombok.Data;

@Data
public class SubSubQuestionModerationDTO {
    private Long subSubQuestionId; // Sub-sub-question ID
    private String comment; // Comment for the sub-sub-question
    private QuestionModerationStatus status; // Updated status
}
