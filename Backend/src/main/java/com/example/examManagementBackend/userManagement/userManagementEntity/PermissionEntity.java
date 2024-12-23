package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="permissions")
public class PermissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionId;

    @Column(nullable = false,unique = true)
    private String permissionName;

    private String permissionDescription;

    @Column(nullable = false)
    private String permissionType;
    //@OneToMany(mappedBy = "rolePermission")
    ///Set<RolePermission> rolePermissions;

    @OneToMany(mappedBy = "permissionEntity") // Make sure this matches the field in RolePermission
    private Set<RolePermission> rolePermissions = new HashSet<>(); // Or List<RolePermission>


    public PermissionEntity() {
    }

    public PermissionEntity(String permissionName, String permissionDescription, String permissionType) {
        this.permissionName = permissionName;
        this.permissionDescription = permissionDescription;
        this.permissionType = permissionType;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }

    public String getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(String permissionType) {
        this.permissionType = permissionType;
    }

    public Long getPermissionId() {
        return permissionId;
    }


}
