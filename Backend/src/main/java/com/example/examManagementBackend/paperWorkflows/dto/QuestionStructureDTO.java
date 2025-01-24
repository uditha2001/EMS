package com.example.examManagementBackend.paperWorkflows.dto;


import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionType;
import lombok.Data;


import java.util.List;

@Data
public class QuestionStructureDTO {
    private Long questionId;
    private int questionNumber;
    private QuestionType questionType;
    private int totalMarks;
    private List<SubQuestionDTO> subQuestions;
    private String moderatorComment;
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;
    private long paperId;

}