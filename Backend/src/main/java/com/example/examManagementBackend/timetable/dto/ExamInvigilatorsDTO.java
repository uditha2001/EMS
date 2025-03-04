package com.example.examManagementBackend.timetable.dto;
import lombok.*;

@Data
public class ExamInvigilatorsDTO {
    private Long id;
    private Long timeTableId;
    private Long invigilatorId;
}
