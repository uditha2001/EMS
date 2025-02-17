package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
public class ForgotPasswordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer forgotPasswordId;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private Integer otp;

    @Column(nullable = false)
    @Setter(AccessLevel.NONE)
    private Date expirationDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @Setter(AccessLevel.NONE)
    private UserEntity user;

    public ForgotPasswordEntity() {
    }

    public ForgotPasswordEntity(Integer otp, Date expirationDate, UserEntity user) {
        this.otp = otp;
        this.expirationDate = expirationDate;
        this.user = user;
    }
}
