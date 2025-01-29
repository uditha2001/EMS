package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleAssignmentRepository extends JpaRepository<RoleAssignmentEntity, Long> {

    // Check if a role assignment already exists for a given combination of course, role, and academic year
    boolean existsByCourseAndRoleAndExaminationId(CoursesEntity course, RolesEntity role, ExaminationEntity academicYear);
    List<RoleAssignmentEntity> findByUserId_UserId(Long userId);
    List<RoleAssignmentEntity> findByExaminationId_Id(Long examinationId);

}

