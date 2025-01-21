package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import lombok.Data;

import java.util.List;

@Data
public class QuestionModerationDTO {
    private Long questionId; // ID of the question (main, sub, or sub-sub)
    private String comment; // Comment by the moderator
    private QuestionModerationStatus status; // Updated status
    private List<SubQuestionModerationDTO> subQuestions;
}


