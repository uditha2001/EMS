package com.example.examManagementBackend.userManagement.userManagementDTO;

import java.util.Set;

public class RoleDTO {
    private Long roleId;
    private String roleName;
    private String description;
    private Set<Long> permissionIds;
    private boolean isProtected;

    public RoleDTO(Long roleId,String roleName, String roleDescription, Set<Long> permissionIds,boolean isProtected ) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.description = roleDescription;
        this.permissionIds = permissionIds;
        this.isProtected=isProtected;

    }

    public Long getRoleId() {
        return roleId;
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

    public boolean isPermanent() {
        return isProtected;
    }
}
