package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
public class ForgotPasswordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer forgotPasswordId;
    @Column(nullable = false)
    private Integer otp;
    @Column(nullable = false)
    private Date expirationDate;
    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity user;

    public Integer getOtp() {
        return otp;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public UserEntity getUser() {
        return user;
    }

    public ForgotPasswordEntity() {
    }

    public ForgotPasswordEntity(Integer otp, Date expirationDate, UserEntity user) {
        this.otp = otp;
        this.expirationDate = expirationDate;
        this.user = user;
    }
}
