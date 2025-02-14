package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentRevisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleAssignmentRevisionRepository extends JpaRepository<RoleAssignmentRevisionEntity, Long> {
    List<RoleAssignmentRevisionEntity> findByRoleAssignment_ExaminationId_Id(Long examinationId);
}
