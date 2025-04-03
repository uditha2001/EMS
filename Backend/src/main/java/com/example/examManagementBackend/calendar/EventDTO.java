package com.example.examManagementBackend.calendar;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private String visibility; // PUBLIC or PRIVATE
    private Long userId;
}
