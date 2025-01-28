package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<RolesEntity, Long> {
    Optional<RolesEntity> findByRoleName(String roleName);

    // Custom query to find roles by role names
    List<RolesEntity> findByRoleNameIn(List<String> roleNames);

    @Query("SELECT re.roleName FROM RolesEntity re")
    List<String> getallRoles();


}
