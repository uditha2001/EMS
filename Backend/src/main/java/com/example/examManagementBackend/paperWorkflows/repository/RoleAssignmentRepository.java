package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.AcademicYearsEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleAssignmentRepository extends JpaRepository<RoleAssignmentEntity, Long> {

    // Check if a role assignment already exists for a given combination of course, role, and academic year
    boolean existsByCourseAndRoleAndAcademicYearId(CoursesEntity course, RolesEntity role, AcademicYearsEntity academicYear);
}

