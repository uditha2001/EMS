package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRolesRepository extends JpaRepository<UserRoles, Long> {}

