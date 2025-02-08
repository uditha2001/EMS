package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
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
@Table(name = "courses")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoursesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    @Size(max = 40000)
    private String description;

    @Column(nullable = false)
    private Integer level;

    @Column(nullable = false)
    private String semester;

    @Column(nullable = false)
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseType courseType; // Added courseType field

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "degree_program_id", referencedColumnName = "id", nullable = false)
    private DegreeProgramsEntity degreeProgramsEntity;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "course")
    private List<ExamPaperEntity> examPaperEntityList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "course")
    private List<EncryptedPaper> encryptedPaperEntityList;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "course")
    private List<RoleAssignmentEntity> roleAssignmentList;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "")
    private List<ExamTimeTablesEntity> examTimeTablesEntityList;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "courses")
    private Set<CourseEvaluationsEntity> courseEvaluationsEntitySet;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "course")
    private Set<ResultEntity> resultEntitySet;

    // Enum for Course Type
    public enum CourseType {
        THEORY,
        PRACTICAL,
        BOTH
    }
}
