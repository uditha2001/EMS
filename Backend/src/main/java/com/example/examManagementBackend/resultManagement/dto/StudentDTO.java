package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentDTO {
    private String studentNumber;
    private String studentName;
    private Float firstMarking;
}
