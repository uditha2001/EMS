package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name="user_roles")
@Data
@EntityListeners(AuditingEntityListener.class)
public class UserRoles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
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


    // Method to check if role should be unassigned based on the grant date
    public boolean isRoleExpired() {
        return grantAt != null && grantAt.isBefore(LocalDateTime.now());
    }


}
