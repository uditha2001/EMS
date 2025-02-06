package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
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

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"examination_id", "fileName"})
        }
)
@NoArgsConstructor
@AllArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
public class EncryptedPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    private String remarks;

    @Column(nullable = false)
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator;

    @ManyToOne
    @JoinColumn(name = "moderator_id", nullable = true)
    private UserEntity moderator;

    @Column(nullable = false)
    private boolean isShared = false;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime sharedAt;

    @CreatedDate
    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "encryptedPaper")
    private List<ModerationsEntity> moderations;

//    @OneToMany(cascade = CascadeType.ALL, mappedBy = "encryptedPaper")
//    private List<PapersCoursesEntity> papersCourses;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "encryptedPaper")
    private List<QuestionStructureEntity> questionStructures;

    @ManyToOne
    @JoinColumn(name = "examination_id", nullable = false)
    private ExaminationEntity examination;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "courseId",referencedColumnName = "id",nullable = false)
    private CoursesEntity course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamPaperStatus status = ExamPaperStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaperType paperType; // THEORY or PRACTICAL

}


