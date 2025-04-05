package com.example.examManagementBackend.timetable.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
public class TimeSlotChangeLogDTO {
    private Long id;
    private LocalDate previousDate;
    private LocalTime previousStartTime;
    private LocalTime previousEndTime;
    private LocalDate newDate;
    private LocalTime newStartTime;
    private LocalTime newEndTime;
    private String changeReason;
    private LocalDateTime changeTimestamp;
    private String changedBy;
    private String courseCode;
    private String paperType;
    private Long examTimeTableId;

}
