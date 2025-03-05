package com.example.examManagementBackend.timetable.dto;

import lombok.Data;

@Data
public class InvigilatorAssignmentDTO {
    private Long examTimeTableId;
    private Long examCenterId;
    private Long invigilatorId;
}
