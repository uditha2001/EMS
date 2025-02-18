package com.example.examManagementBackend.userManagement.userManagementEntity;

import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Table(name="roles")
public class RolesEntity {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;
    @Setter
    @Getter
    @Column(nullable = false,unique = true)
    private String roleName;
    @Setter
    @Getter
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


    public boolean isProtected() {
        return isProtected;
    }

    public void setProtected(boolean isProtected) {
        this.isProtected = isProtected;
    }
}
