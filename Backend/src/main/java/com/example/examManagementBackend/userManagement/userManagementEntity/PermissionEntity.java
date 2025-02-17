package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="permissions")
@Data
public class PermissionEntity {
    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long permissionId;

    @Column(nullable = false,unique = true)
    private String permissionName;

    private String permissionDescription;

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
    @Override
    public String toString() {
        return "PermissionEntity{" +
                "permissionId=" + permissionId +
                ", permissionName='" + permissionName + '\'' +
                ", permissionDescription='" + permissionDescription + '\'' +
                ", permissionType='" + permissionType + '\'' +
                '}';
    }



}
