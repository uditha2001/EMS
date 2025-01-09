package com.example.examManagementBackend.userManagement.userManagementEntity;

import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import jakarta.persistence.*;

import java.util.List;
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
    @OneToMany(mappedBy = "role",cascade = CascadeType.ALL)
    Set<UserRoles> userRoles;
    @OneToMany(mappedBy = "rolesEntity",cascade = CascadeType.ALL)
    Set<RolePermission> rolePermissions;
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean isProtected = false; // Flag to indicate seeded roles
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "role")
    private List<RoleAssignmentEntity> roleAssignments;

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


    public boolean isProtected() {
        return isProtected;
    }

    public void setProtected(boolean isProtected) {
        this.isProtected = isProtected;
    }
}
