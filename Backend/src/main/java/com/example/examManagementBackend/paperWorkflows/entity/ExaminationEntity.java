package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.examManagement.entities.ExamTimeTablesEntity;
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

    @ManyToOne
    @JoinColumn(name = "degree_program_id", referencedColumnName = "id", nullable = false)
    private DegreeProgramsEntity degreeProgramsEntity;
    @OneToMany(mappedBy = "examination",cascade = CascadeType.ALL)
    private List<ExamTimeTablesEntity> examTimeTables;
}
