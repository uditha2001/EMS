package com.example.examManagementBackend.paperWorkflows.dto;


import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class SubQuestionDTO {
    private Long subQuestionId;
    private int subQuestionNumber;
    private QuestionType questionType;
    private float marks;
    private List<SubSubQuestionDTO> subSubQuestions;
    private String moderatorComment;
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;
}