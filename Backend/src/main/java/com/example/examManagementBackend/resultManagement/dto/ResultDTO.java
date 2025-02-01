package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResultDTO {
   String studentNumber;
   String studentName;
   String examName;
   String courseCode;
   String examType;
   Integer firstMarking;

}
