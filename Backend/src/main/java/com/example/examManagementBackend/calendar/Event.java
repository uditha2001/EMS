package com.example.examManagementBackend.calendar;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    private Long userId;

    public enum Visibility {
        PUBLIC,
        PRIVATE
    }
}

