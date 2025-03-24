package com.example.examManagementBackend.paperWorkflows.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseDTO {
        private Long id;
        @NotEmpty(message = "Code cannot be empty")
        private String code;
        @NotEmpty(message = "Name cannot be empty")
        private String name;
        private String description;
        private Integer level;
        private String semester;
        private Boolean isActive;
        @NotEmpty(message = "Course type cannot be empty")
        private String courseType;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long degreeProgramId;
        private String degreeName;
        private List<CourseEvaluationsDTO> courseEvaluations;

}
