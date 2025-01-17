package com.example.examManagementBackend.paperWorkflows.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DegreeProgramDTO {
    private Long id;
    @NotEmpty
    private String name;
    @NotEmpty
    private String description;
    private LocalDateTime createdAt; // To capture the creation timestamp
    private LocalDateTime updatedAt; // To capture the last update timestamp
}
