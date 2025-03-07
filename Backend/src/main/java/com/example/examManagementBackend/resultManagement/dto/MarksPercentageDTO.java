package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarksPercentageDTO{
    private String examType;
    private float passMark;
    private float weightage;
    private String courseCode;
}
