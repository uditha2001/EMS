package com.example.examManagementBackend.timetable.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class ExamTimeTableDTO {
    private Long examTimeTableId;
    private Long examinationId;
    private Long courseId;
    private Long examTypeId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime endTime;

    private String courseCode;
    private String courseName;
    private String examType;
    private LocalDateTime updatedAt;
    private String timetableGroup;

}
