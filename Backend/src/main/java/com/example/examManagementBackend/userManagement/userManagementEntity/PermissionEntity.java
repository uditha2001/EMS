package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="permissions")
public class PermissionEntity {
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionId;

    @Getter
    @Column(nullable = false,unique = true)
    private String permissionName;

    @Getter
    private String permissionDescription;

    @Getter
    @Column(nullable = false)
    private String permissionType;
    //@OneToMany(mappedBy = "rolePermission")
    ///Set<RolePermission> rolePermissions;

    @OneToMany(mappedBy = "permissionEntity",cascade = CascadeType.ALL) // Make sure this matches the field in RolePermission
    private Set<RolePermission> rolePermissions = new HashSet<>(); // Or List<RolePermission>


    public PermissionEntity() {
    }

    public PermissionEntity(String permissionName, String permissionDescription, String permissionType) {
        this.permissionName = permissionName;
        this.permissionDescription = permissionDescription;
        this.permissionType = permissionType;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }

    public void setPermissionType(String permissionType) {
        this.permissionType = permissionType;
    }


}
