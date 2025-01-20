package com.example.examManagementBackend.paperWorkflows.dto.FeedBackData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDTO {
    private questionData[] Question;
    private String generalComment;
    private String learningOutcomes;
    private String courseContent;
    private String degreeProgram;
    private String courseCode;
    private String courseName;
    private String examination;
    private String agreeAndAddressed;
    private String notAgreeAndReasons;

}
