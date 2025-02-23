package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
        private String courseType; // Added courseType field as String for flexibility
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Long degreeProgramId;
        private String degreeName;

}
