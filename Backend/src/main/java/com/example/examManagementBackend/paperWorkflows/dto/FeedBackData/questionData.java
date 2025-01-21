package com.example.examManagementBackend.paperWorkflows.dto.FeedBackData;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class questionData {
    @JsonProperty("id")
    private int id;

    @JsonProperty("answer")
    private String answer;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("Question")
    private String Question;

}
