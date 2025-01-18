package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class SubQuestionDTO {
    private int subQuestionNumber;
    private QuestionType questionType;
    private int marks;
    private List<SubSubQuestionDTO> subSubQuestions;
}