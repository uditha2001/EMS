package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@EntityListeners(AuditingEntityListener.class)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ExamInitializationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date examDate;
    private String academicYear;
    @Column(nullable = false)
    private Enum<Exam_Initialization_status> status;
    @CreatedDate
    @Column(updatable = false,nullable = false)
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime updatedAt;

}
