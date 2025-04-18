package com.example.examManagementBackend.resultManagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
public class DataForCalCulationDTO {
    Float marks;
    String Grade;
    LocalDateTime publishedAt;
    String courseCode;

    public DataForCalCulationDTO(Float marks, String grade, LocalDateTime publishedAt, String courseCode) {
        this.marks = marks;
        this.Grade = grade;
        this.publishedAt = publishedAt;
        this.courseCode = courseCode;
    }
}

