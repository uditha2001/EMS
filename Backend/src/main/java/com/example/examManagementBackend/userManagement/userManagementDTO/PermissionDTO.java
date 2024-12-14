package com.example.examManagementBackend.userManagement.userManagementDTO;

public class PermissionDTO {
    private String permissionName;
    private String permissionDescription;
    private String category;
    public PermissionDTO(String permissionName, String permissionDescription, String category) {
        this.permissionName = permissionName;
        this.permissionDescription = permissionDescription;
        this.category = category;
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
