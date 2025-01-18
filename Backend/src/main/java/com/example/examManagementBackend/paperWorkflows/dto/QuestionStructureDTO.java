package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class QuestionStructureDTO {
    private int questionNumber;
    private QuestionType questionType;
    private int totalMarks;
    private List<SubQuestionDTO> subQuestions;
}