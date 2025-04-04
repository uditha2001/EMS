package com.example.examManagementBackend.timetable.entities;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "timetable_center")
public class ExamTimeTableCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "examTimeTableId")
    private ExamTimeTablesEntity examTimeTable;

    @ManyToOne
    @JoinColumn(name = "examCenterId")
    private ExamCentersEntity examCenter;

    @ManyToOne
    @JoinColumn(name="supervisor", referencedColumnName = "userId")
    private UserEntity supervisor;

    private Integer numOfCandidates;
}
