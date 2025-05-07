package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MedicalSubmitDTO {
    private String studentNumber;
    private String status;
}
