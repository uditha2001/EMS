package com.example.examManagementBackend.paperWorkflows.dto;


import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import lombok.Data;

import java.util.List;

@Data
public class SubQuestionModerationDTO {

    private Long subQuestionId; // Sub-question ID
    private String comment; // Comment for the sub-question
    private QuestionModerationStatus status; // Updated status
    private List<SubSubQuestionModerationDTO> subSubQuestions;
}
