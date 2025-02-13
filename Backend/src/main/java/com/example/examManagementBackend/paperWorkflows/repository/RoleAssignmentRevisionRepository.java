package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentRevisionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleAssignmentRevisionRepository extends JpaRepository<RoleAssignmentRevisionEntity, Long> {
}
