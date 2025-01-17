package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.ForgotPasswordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Repository
@EnableJpaRepositories
public interface ForgotPasswordRepo extends JpaRepository<ForgotPasswordEntity, Long> {
    @Query("SELECT fpe FROM ForgotPasswordEntity fpe where fpe.user.username= :username")
    ForgotPasswordEntity getdatabyUser(@Param("username") String username);

    @Query("SELECT fpe FROM ForgotPasswordEntity fpe where fpe.user.userId= :userId")
    ForgotPasswordEntity extractdatabyUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE ForgotPasswordEntity fpe SET fpe.otp= :otp,fpe.expirationDate= :date WHERE fpe.user.username= :username")
    void updateNewOtp(@Param("otp") Integer otp, @Param("date") Date date, @Param("username") String username);
}
