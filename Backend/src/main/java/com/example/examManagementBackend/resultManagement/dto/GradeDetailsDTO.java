package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GradeDetailsDTO {
    String studentName;
    String studentNumber;
    Map<String,Float> examTypesName;
    float TotalMarks;
    String grade;
    Map<String, List<String>> failedStudents;
}
