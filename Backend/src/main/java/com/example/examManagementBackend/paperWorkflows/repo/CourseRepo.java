package com.example.examManagementBackend.paperWorkflows.repo;

import com.example.examManagementBackend.paperWorkflows.entity.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepo extends JpaRepository<CourseEntity, Long> {
}