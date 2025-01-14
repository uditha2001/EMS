package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.PapersCoursesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PapersCoursesRepository extends JpaRepository<PapersCoursesEntity, Long> {
    // You can define custom queries here if needed.
}
