package com.example.examManagementBackend.userManagement.userManagementDTO;

public class AcessTokenDTO {
    private String token;

    public AcessTokenDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
