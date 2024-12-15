package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class PermissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionId;

    @Column(nullable = false,unique = true)
    private String permissionName;

    private String permissionDescription;

    @Column(nullable = false)
    private String permissionType;
    @OneToMany(mappedBy = "rolePermission")
    Set<RolePermission> rolePermissions;
}
