package com.example.examManagementBackend.paperWorkflows.dto;


import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionType;
import lombok.Data;

@Data
public class SubSubQuestionDTO {
    private Long subSubQuestionId;
    private int subSubQuestionNumber;
    private QuestionType questionType;
    private float marks;
    private String moderatorComment;
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;
}
