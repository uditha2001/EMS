package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rolePermissionid;

    @ManyToOne
    @JoinColumn(name="roleId")
    private RolesEntity rolesEntity;
    @ManyToOne
    @JoinColumn(name="permissionId")
    private PermissionEntity rolePermission;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime grantedAt;

}
