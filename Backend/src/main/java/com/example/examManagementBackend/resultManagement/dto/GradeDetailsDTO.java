package com.example.examManagementBackend.resultManagement.dto;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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

}
