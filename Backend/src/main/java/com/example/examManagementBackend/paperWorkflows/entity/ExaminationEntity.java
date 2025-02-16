package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(
        name = "examinations",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"year", "level", "semester", "degree_program_id"}
        )
)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ExaminationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String year;

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "examinationId")
    private List<RoleAssignmentEntity> roleAssignments;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "examination")
    private List<EncryptedPaper> encryptedPapers;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private String semester;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "degree_program_id", referencedColumnName = "id", nullable = false)
    private DegreeProgramsEntity degreeProgramsEntity;
    @OneToMany(mappedBy = "examination",cascade = CascadeType.ALL)
    private List<ExamTimeTablesEntity> examTimeTables;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "examination")
    private List<ResultEntity> results;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime examProcessStartDate;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime paperSettingCompleteDate;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime markingCompleteDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExamStatus status = ExamStatus.SCHEDULED;

    @PrePersist
    @PreUpdate
    private void updateStatus() {
        LocalDateTime now = LocalDateTime.now();

        if (markingCompleteDate != null && now.isAfter(markingCompleteDate)) {
            status = ExamStatus.COMPLETED;
        } else if (paperSettingCompleteDate != null && now.isAfter(paperSettingCompleteDate)) {
            status = ExamStatus.ONGOING;
        } else if (examProcessStartDate != null && now.isAfter(examProcessStartDate)) {
            status = ExamStatus.ONGOING;
        } else {
            status = ExamStatus.SCHEDULED;
        }
    }

}
