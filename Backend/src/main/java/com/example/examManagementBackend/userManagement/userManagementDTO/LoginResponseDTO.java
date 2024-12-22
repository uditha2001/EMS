package com.example.examManagementBackend.userManagement.userManagementDTO;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.User;


public class LoginResponseDTO {
    private String token;
    private UserEntity user;
    public LoginResponseDTO(String token) {
        this.token = token;

    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
