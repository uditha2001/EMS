package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleWithPermissionsDTO;
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
    @Query("SELECT ur FROM UserRoles ur WHERE ur.user = :userid")
    List<UserRoles> extractusers(@Param("userid") Long userId);
}

