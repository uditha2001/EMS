package com.example.examManagementBackend.userManagement.userManagementDTO;

import java.util.List;

public class RoleWithPermissionsDTO {
    private String roleName;
    private String roleDescription;
    private List<String> permissions;

    public RoleWithPermissionsDTO(String roleName, String roleDescription, List<String> permissions) {
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.permissions = permissions;
    }

    // Getters
    public String getRoleName() {
        return roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    // Setters
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
