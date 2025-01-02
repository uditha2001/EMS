package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@EnableJpaRepositories
public interface UserManagementRepo extends JpaRepository<UserEntity,Long> {
    UserEntity findByUsername(String username);
    @Modifying
    @Transactional
    @Query("UPDATE UserEntity ur set ur.password= :password WHERE ur.username= :username")
    void updatePassword(@Param("username") String username,@Param("password") String password);
}
