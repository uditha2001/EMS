package com.example.examManagementBackend.resultManagement.dto;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarksPercentageDTO{
    private ExamTypesName examType;
    private float passMark;
    private float weightage;

}
