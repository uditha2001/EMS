package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

import static com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus.FIRST_MARKING_COMPLETE;
import static com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus.PENDING;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="result")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResultEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;
    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="examination_id",referencedColumnName = "id",nullable = false)
    private ExaminationEntity examination;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="course_id",referencedColumnName = "id",nullable = false)
    private CoursesEntity course;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="exam_type",referencedColumnName = "id",nullable = false)
    private ExamTypesEntity examType;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="student_id",referencedColumnName = "studentId",nullable = false)
    private StudentsEntity student;

    @Column(nullable = true)
    private float firstMarking;
    @Column(nullable = true)
    private float secondMarking;
    @Column(nullable = true)
    private float finalMarks;

    @Enumerated(EnumType.STRING)
    private ResultStatus status=PENDING;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="approved_by",referencedColumnName = "userId")
    private UserEntity approvedBy;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime publishAt;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    private boolean isAbsent=false;
    private boolean hasSubmittedMedical=false;

}
