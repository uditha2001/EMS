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

    public RolesEntity() {
    }

    public RolesEntity(String roleName, String roleDescription, Set<UserRoles> userRoles, Set<RolePermission> rolePermissions) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.userRoles = userRoles;
        this.rolePermissions = rolePermissions;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public Set<UserRoles> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<UserRoles> userRoles) {
        this.userRoles = userRoles;
    }

    public Set<RolePermission> getRolePermissions() {
        return rolePermissions;
    }

    public void setRolePermissions(Set<RolePermission> rolePermissions) {
        this.rolePermissions = rolePermissions;
    }

    public Long getRoleId() {
        return roleId;
    }
}
