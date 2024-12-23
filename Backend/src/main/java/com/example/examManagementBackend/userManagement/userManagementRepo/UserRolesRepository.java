package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface UserRolesRepository extends JpaRepository<UserRoles, Long> {
    @Query("SELECT ur FROM UserRoles ur WHERE ur.user.userId = :user_id")
    List<UserRoles> extractusers(@Param("user_id") Long userId);

    // Find all roles associated with a specific user
    List<UserRoles> findByUser(UserEntity user);

    // Delete all roles associated with a specific user
    void deleteByUser(UserEntity user);
}

