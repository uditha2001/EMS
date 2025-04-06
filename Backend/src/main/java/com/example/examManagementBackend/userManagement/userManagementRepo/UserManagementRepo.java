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

import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface UserManagementRepo extends JpaRepository<UserEntity,Long> {
    UserEntity findByUsername(String username);
    @Modifying
    @Transactional
    @Query("UPDATE UserEntity ur set ur.password= :password WHERE ur.username= :username")
    void updatePassword(@Param("username") String username,@Param("password") String password);

    boolean existsByUsername(String username);
    Optional<UserEntity> findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE UserEntity  ur set ur.publicKey= :publickey WHERE  ur.username= :username")
    void updatePublicKey(@Param("username") String username,@Param("publickey") String publickey);

    @Query("select ur.publicKey FROM UserEntity  ur where ur.username= :username")
    String getPublicKey(@Param("username") String username);

    @Query("SELECT COUNT(ue) FROM UserEntity ue WHERE ue.isActive = true")
    int getAllActiveUsers();
    @Query("SELECT ur.userId FROM UserEntity ur WHERE ur.username=:usrName")
    Long getUserIdByUsername(@Param("usrName") String usrName);
}
