package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PublishedResultsDTO {
    private Long id;
    private Float marks;
    private String grade;
    private String course;
    private String year;

}
