package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecorrectionResultsDTO {
    String studentNumber;
    Float  oldMarks;
    Float  newMarks;
    String newGrade;
    String reason;
}
