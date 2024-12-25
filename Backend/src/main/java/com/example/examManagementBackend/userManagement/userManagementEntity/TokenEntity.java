package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;

@Entity
public class TokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long token_id;
    private String refreshToken;
    private String acessToken;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity user;

    public TokenEntity() {
    }

    public TokenEntity(String refreshToken, Long token_id, UserEntity user, String acessToken) {
        this.refreshToken = refreshToken;
        this.token_id = token_id;
        this.user = user;
        this.acessToken = acessToken;
    }

    public String getAcessToken() {
        return acessToken;
    }

    public void setAcessToken(String acessToken) {
        this.acessToken = acessToken;
    }

    public Long getToken_id() {
        return token_id;
    }

    public void setToken_id(Long token_id) {
        this.token_id = token_id;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String token) {
        this.refreshToken = token;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
