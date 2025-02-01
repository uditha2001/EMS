package com.example.examManagementBackend.examManagement.entities;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="exam_invigilators ")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamInvigilatorsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invigilatorId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="time_table_id",referencedColumnName = "examTimeTableId")
    private ExamTimeTablesEntity examTimeTables;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="invigilator_id",referencedColumnName = "userId")
    private UserEntity invigilator_id;
}
