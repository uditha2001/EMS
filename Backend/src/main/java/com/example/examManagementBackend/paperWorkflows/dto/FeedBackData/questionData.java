package com.example.examManagementBackend.paperWorkflows.dto.FeedBackData;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class questionData {
    private int id;
    private String answer;
    private String comment;
    private String[] questions;

}
