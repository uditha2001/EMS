package com.example.examManagementBackend.userManagement.userManagementEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Entity
@Getter
@Setter
public class ForgotPasswordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer forgotPasswordId;
    @Column(nullable = false)
    private Integer otp;
    @Column(nullable = false)
    private Date expirationDate;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity user;


    public ForgotPasswordEntity() {
    }

    public ForgotPasswordEntity(Integer otp, Date expirationDate, UserEntity user) {
        this.otp = otp;
        this.expirationDate = expirationDate;
        this.user = user;
    }
}
