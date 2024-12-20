package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.RolePermission;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    void deleteAllByRolesEntity(RolesEntity role);

    @Query("SELECT rp FROM RolePermission rp WHERE rp.rolesEntity = :rolesEntity")
    List<RolePermission> findByRolesEntity(@Param("rolesEntity") RolesEntity rolesEntity);



}
