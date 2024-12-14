package com.example.examManagementBackend.userManagement.userManagementDTO;

public class RolesDTO {
    private int roleName;
    private String description;

    public RolesDTO(int roleName, String description) {
        this.roleName = roleName;
        this.description = description;
    }

    public int getRoleName() {
        return roleName;
    }

    public void setRoleName(int roleName) {
        this.roleName = roleName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
