package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name="user_roles")
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

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime grantAt;  // New field to store the grant date

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

    public LocalDateTime getGrantAt() {
        return grantAt;
    }

    public void setRole(RolesEntity role) {
        this.role = role;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setGrantAt(LocalDateTime grantAt) {
        this.grantAt = grantAt;
    }

    // Method to check if role should be unassigned based on the grant date
    public boolean isRoleExpired() {
        return grantAt != null && grantAt.isBefore(LocalDateTime.now());
    }


}
