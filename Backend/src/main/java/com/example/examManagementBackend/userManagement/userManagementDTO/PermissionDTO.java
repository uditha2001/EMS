package com.example.examManagementBackend.userManagement.userManagementDTO;

public class PermissionDTO {
    private String permissionName;
    private Long permissionId;
    private String permissionDescription;
    private String category;
    public PermissionDTO(Long permissionId,String permissionName, String permissionDescription, String category) {
        this.permissionId=permissionId;
        this.permissionName = permissionName;
        this.permissionDescription = permissionDescription;
        this.category = category;
    }
    public Long getPermissionId() {
        return permissionId;
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
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

}
