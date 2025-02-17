package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Data
public class TokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long token_id;
    private String refreshToken;
    private String acessToken;
    @OneToOne(cascade = CascadeType.ALL)
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

}
