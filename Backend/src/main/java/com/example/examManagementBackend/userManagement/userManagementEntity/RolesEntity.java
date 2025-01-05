package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name="roles")
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

    public RolesEntity(String roleName, String roleDescription) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
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

    public Long getRoleId() {

        return roleId;
    }


}
