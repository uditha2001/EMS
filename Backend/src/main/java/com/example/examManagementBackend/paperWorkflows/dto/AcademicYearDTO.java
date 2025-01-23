package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearDTO {
    private Long id;
    private String year;
    private String level;
    private String semester;
    private Long degreeProgramId;
}
