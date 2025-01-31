package com.example.examManagementBackend.examManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name="exam_time_table")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamTimeTablesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long examTimeTableId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="examinationId",referencedColumnName = "id")
    private ExaminationEntity examination;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="course_id",referencedColumnName = "id")
    private CoursesEntity course;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="exam_type",referencedColumnName = "id")
    private ExamTypesEntity examType;

    @ManyToMany(cascade=CascadeType.ALL)
    @JoinTable(
            name = "center_name",
            joinColumns = @JoinColumn(name = "examTimeTableId"),
            inverseJoinColumns = @JoinColumn(name = "id")
    )
    private Set<ExamCentersEntity> centers;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="supervisor",referencedColumnName = "userId")
    private UserEntity supervisor;
    @Column(columnDefinition = "DATE")
    private LocalDate date;
    @Column(columnDefinition = "TIME")
    private LocalTime startTime;
    @Column(columnDefinition = "TIME")
    private LocalTime endTime;

}
