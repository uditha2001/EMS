package com.example.examManagementBackend.timetable.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="exam_time_table")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExamTimeTablesEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long examTimeTableId;

    @ManyToOne
    @JoinColumn(name="examinationId", referencedColumnName = "id")
    private ExaminationEntity examination;

    @ManyToOne
    @JoinColumn(name="course_id", referencedColumnName = "id")
    private CoursesEntity course;

    @ManyToOne
    @JoinColumn(name="exam_type", referencedColumnName = "id")
    private ExamTypesEntity examType;

    @OneToMany(mappedBy = "examTimeTable", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ExamTimeTableCenter> examCenters = new HashSet<>();

    @Column(columnDefinition = "DATE")
    private LocalDate date;

    @Column(columnDefinition = "TIME")
    private LocalTime startTime;

    @Column(columnDefinition = "TIME")
    private LocalTime endTime;

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @Column
    private String timetableGroup;


    @Column
    private boolean approved = false;
}
