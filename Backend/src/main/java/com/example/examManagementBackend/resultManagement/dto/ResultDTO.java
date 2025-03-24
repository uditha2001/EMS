package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultDTO {
   private Long id;
   private String examName;
   private String courseCode;
   private String examType;
   private List<StudentDTO> studentsData;
}
