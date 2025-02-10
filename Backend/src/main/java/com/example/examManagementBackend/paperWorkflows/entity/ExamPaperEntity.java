package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.paperWorkflows.entity.moderatorFeedbacks.FeedBackDataEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="exam_paper")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamPaperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String filePath;
    @Column(nullable = false)
    private ExamPaperStatus status=ExamPaperStatus.DRAFT;
    @CreatedDate
    @Column(nullable = false,columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(nullable = false,columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "courseId",referencedColumnName = "id",nullable = false)
    private CoursesEntity course;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "createdBy",referencedColumnName = "username")
    private UserEntity user;
    @OneToOne(mappedBy = "examPaperEntity",cascade = CascadeType.ALL)
    private FeedBackDataEntity feedBackData;


}
