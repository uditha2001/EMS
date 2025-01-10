package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
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
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name="role_assignment")
public class RoleAssignmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Boolean isAuthorized;

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="course_id")
    private CoursesEntity course;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="role_id")
    private RolesEntity role;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="user_id")
    private UserEntity userId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="acedemic_year_id")
    private AcademicYearsEntity academicYearId;


}
