package com.example.examManagementBackend.paperWorkflows.dto.FeedBackData;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDTO {
    @JsonProperty("question")
    private questionData[] question;
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
