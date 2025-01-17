package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AcademicYearDTO {
    private Long id;
    private String year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
