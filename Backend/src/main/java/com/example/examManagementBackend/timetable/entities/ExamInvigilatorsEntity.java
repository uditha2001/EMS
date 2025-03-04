package com.example.examManagementBackend.timetable.entities;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="exam_invigilators ")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ExamInvigilatorsEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="time_table_id",referencedColumnName = "examTimeTableId")
    private ExamTimeTablesEntity examTimeTables;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="invigilator_id",referencedColumnName = "userId")
    private UserEntity invigilators;
}
