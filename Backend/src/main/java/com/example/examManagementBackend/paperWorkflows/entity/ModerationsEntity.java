package com.example.examManagementBackend.paperWorkflows.entity;

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
@Table(name = "moderations")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ModerationsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String feedback;
    @Column(nullable = false)
    private ModerationsStatus status=ModerationsStatus.PENDING;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(referencedColumnName = "id",name = "exam_paper_id",nullable = false)
    private ExamPaperEntity examPaper;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(referencedColumnName = "userId",name="moderators")
    private UserEntity moderator;






}
