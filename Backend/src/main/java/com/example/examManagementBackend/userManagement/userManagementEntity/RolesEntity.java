package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class RolesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;
    @Column(nullable = false,unique = true)
    private String roleName;
    @Column
    private String roleDescription;
    @OneToMany(mappedBy = "role")
    Set<UserRoles> userRoles;
    @OneToMany(mappedBy = "rolesEntity")
    Set<RolePermission> rolePermissions;

}
