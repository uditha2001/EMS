package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRolesRepository extends JpaRepository<UserRoles, Long> {
    // Find all roles associated with a specific user
    List<UserRoles> findByUser(UserEntity user);

    // Delete all roles associated with a specific user
    void deleteByUser(UserEntity user);
}

