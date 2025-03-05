package com.example.examManagementBackend.timetable.dto;

import lombok.Data;

@Data
public class ExamCenterAllocationDTO {
    private Long examTimeTableId;
    private Long examCenterId;
    private Integer numOfCandidates;
}
