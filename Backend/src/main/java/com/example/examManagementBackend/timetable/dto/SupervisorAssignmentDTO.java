package com.example.examManagementBackend.timetable.dto;

import lombok.Data;

@Data
public class SupervisorAssignmentDTO {
    private Long examTimeTableId;
    private Long examCenterId;
    private Long supervisorId;
}
