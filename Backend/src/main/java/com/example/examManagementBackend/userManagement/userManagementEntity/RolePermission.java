package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "role_permissions")
@Data
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_permission_id")
    @Setter(AccessLevel.NONE)
    private Long rolePermissionId;

   // @ManyToOne(cascade = CascadeType.ALL) 
    @ManyToOne
    @JoinColumn(name = "role_id")  // Ensure the column name matches the actual DB column
    private RolesEntity rolesEntity;

    //@ManyToOne(cascade = CascadeType.ALL)
    @ManyToOne
    @JoinColumn(name = "permission_id")  // Ensure the column name matches the actual DB column
    private PermissionEntity permissionEntity;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime grantedAt;

    // No-arg constructor (required by JPA)
    public RolePermission() {}

    // All-args constructor for convenience
    public RolePermission(RolesEntity rolesEntity, PermissionEntity permissionEntity) {
        this.rolesEntity = rolesEntity;
        this.permissionEntity = permissionEntity;
    }

}
