package com.example.examManagementBackend.timetable.dto;

import lombok.Data;

@Data
public class TimeTableCoursesDTO {
    private Long id;
    private String name;
    private String code;
    private String courseType;
}
