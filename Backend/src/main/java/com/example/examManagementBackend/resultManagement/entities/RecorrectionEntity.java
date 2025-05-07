package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="recorrection_results")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RecorrectionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recorrectionId;
    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="examination_id",referencedColumnName = "id",nullable = false)
    private ExaminationEntity examination;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="course_id",referencedColumnName = "id",nullable = false)
    private CoursesEntity course;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="student_id",referencedColumnName = "studentId",nullable = false)
    private StudentsEntity student;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="approved_by",referencedColumnName = "userId",nullable = false)
    private UserEntity approvedBy;
    @Column(nullable = false)
    private float oldMarks;
    private float newMarks;
    @Column(columnDefinition = "TEXT")
    private String Reason;
    private String newGrade;


    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;



}
