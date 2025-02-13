package com.example.examManagementBackend.resultManagement.dto;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamTypesDTO {
    private Long id;
    private ExamTypesName name;


}
