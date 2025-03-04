
package com.example.examManagementBackend.timetable.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
public class ExamCentersDTO {
    private Long id;
    private String name;
    private String location;
    private Integer capacity;
    private String contactPerson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
