package com.example.examManagementBackend.resultManagement.dto;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultDTO {
   private String examName;
   private String courseCode;
   private ExamTypesName examType;
   private List<StudentDTO> studentsData;
}
