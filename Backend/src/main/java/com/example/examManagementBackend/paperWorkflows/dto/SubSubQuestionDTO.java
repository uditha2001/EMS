package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionType;
import lombok.Data;

@Data
public class SubSubQuestionDTO {
    private int subSubQuestionNumber;
    private QuestionType questionType;
    private int marks;
}
