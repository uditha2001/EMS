package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.QuestionType;
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