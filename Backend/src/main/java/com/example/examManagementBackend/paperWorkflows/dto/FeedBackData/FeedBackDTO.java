package com.example.examManagementBackend.paperWorkflows.dto.FeedBackData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.aspectj.weaver.patterns.TypePatternQuestions;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDTO {
    private QuestionObj questionObj;
    private String genaralComment;
    private String learningOutcomes;
    private String courseContent;
    private String degreeProgram;
    private String courseCode;
    private String courseName;
    private String examination;
    private String agreeAndAddressed;
    private String notAgreeAndReasons;

}
