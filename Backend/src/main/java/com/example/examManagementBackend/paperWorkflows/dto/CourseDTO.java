package com.example.examManagementBackend.paperWorkflows.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseDTO {



        @NotEmpty
        private Long id;
        @NotEmpty
        private String code;
        @NotEmpty
        private String name;
        @NotNull
        @Size(max = 40000)
        private String description;
        @NotNull
        private Integer level;
        @NotEmpty
        private int semester;
    }

