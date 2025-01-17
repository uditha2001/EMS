package com.example.examManagementBackend.paperWorkflows.entity;

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
@Table(name = "papers_courses")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PapersCoursesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)  // Adjust cascade type
    @JoinColumn(name = "paper_id")
    private ExamPaperEntity examPaper;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)  // Adjust cascade type
    @JoinColumn(name = "encrypted_paper_id",referencedColumnName = "id")
    private EncryptedPaper encryptedPaper;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)  // Adjust cascade type
    @JoinColumn(name = "course_id")
    private CoursesEntity course;

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
}

