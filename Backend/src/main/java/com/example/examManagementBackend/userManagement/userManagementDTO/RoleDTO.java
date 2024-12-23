package com.example.examManagementBackend.userManagement.userManagementDTO;

import java.util.Set;

public class RoleDTO {
    private String roleName;
    private String description;
    private Set<Long> permissionIds;

    public RoleDTO(String roleName, String roleDescription, Set<Long> permissionIds) {
        this.roleName = roleName;
        this.description = roleDescription;
        this.permissionIds = permissionIds;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Long> getPermissionIds() {
        return permissionIds;
    }

    public void setPermissionIds(Set<Long> permissionIds) {
        this.permissionIds = permissionIds;
    }
}
