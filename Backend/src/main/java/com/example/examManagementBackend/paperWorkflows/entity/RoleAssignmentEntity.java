package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(
        name = "role_assignment",
        uniqueConstraints = @UniqueConstraint(columnNames = {"examination_id", "course_id", "role_id","paperType"})
)
public class RoleAssignmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Boolean isAuthorized=false;

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="course_id",nullable = false)
    private CoursesEntity course;

    @ManyToOne(cascade = CascadeType.ALL )
    @JoinColumn(name = "role_id", nullable = false)
    private RolesEntity role;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="user_id",nullable = false)
    private UserEntity userId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="examination_id",nullable = false)
    private ExaminationEntity examinationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaperType paperType; // THEORY or PRACTICAL

    @OneToMany(mappedBy = "roleAssignment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoleAssignmentRevisionEntity> revisions; // Track changes to user assignments

}
