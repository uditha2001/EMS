package com.example.examManagementBackend.timetable.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class ExamTimeTableWithResourcesDTO {
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
    private List<ExamCenterDTO> examCenters;

    @Data
    public static class ExamCenterDTO {
        private Long allocationId;
        private Long examCenterId;
        private String examCenterName;
        private String location;
        private String capacity;
        private Integer numOfCandidates;
        private SupervisorDTO supervisor;
        private List<InvigilatorDTO> invigilators;
    }

    @Data
    public static class SupervisorDTO {
        private Long supervisorId;
        private String supervisorName;
        private String email;
    }

    @Data
    public static class InvigilatorDTO {
        private Long assignedId;
        private Long invigilatorId;
        private String invigilatorName;
        private String email;
    }
}
