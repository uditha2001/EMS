package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class UserRoles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="userId")
    UserEntity user;

    @ManyToOne
    @JoinColumn(name="roleId")
    RolesEntity role;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime assignedAt;

    public UserEntity getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }

    public RolesEntity getRole() {
        return role;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
}
