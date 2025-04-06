package com.example.examManagementBackend.timetable.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
public class TimeSlotChangeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "examTimeTableId")
    private ExamTimeTablesEntity examTimeTable;

    private LocalDate previousDate;
    private LocalTime previousStartTime;
    private LocalTime previousEndTime;

    private LocalDate newDate;
    private LocalTime newStartTime;
    private LocalTime newEndTime;

    private String changeReason;
    private LocalDateTime changeTimestamp;
    private String changedBy;

}