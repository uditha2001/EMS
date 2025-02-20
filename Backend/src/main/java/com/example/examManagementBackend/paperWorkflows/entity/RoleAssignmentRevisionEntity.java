package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "role_assignment_revisions")
public class RoleAssignmentRevisionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_assignment_id", nullable = false)
    private RoleAssignmentEntity roleAssignment; // Link to original role assignment

    @ManyToOne
    @JoinColumn(name = "previous_user_id", nullable = false)
    private UserEntity previousUser; // The user before the change

    @ManyToOne
    @JoinColumn(name = "new_user_id", nullable = false)
    private UserEntity newUser; // The newly assigned user

    @Column(length = 500, nullable = false)
    private String revisionReason; // Reason for user change

    @ManyToOne
    @JoinColumn(name = "revised_by", nullable = false)
    private UserEntity revisedBy; // Who made the change

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime revisedAt; // When the revision happened
}
