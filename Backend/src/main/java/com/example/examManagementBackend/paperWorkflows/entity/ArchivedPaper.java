package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "archived_papers")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ArchivedPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String filePath;
    private String remarks;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator;

    @ManyToOne
    @JoinColumn(name = "moderator_id")
    private UserEntity moderator;

    @Column(nullable = false)
    private boolean isShared;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime sharedAt;

    @CreatedDate
    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "examination_id", nullable = false)
    private ExaminationEntity examination;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "course_id",nullable = false)
    private CoursesEntity course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaperType paperType; // THEORY or PRACTICAL
}
