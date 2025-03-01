package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamTypesRepository extends JpaRepository<ExamTypesEntity, Long> {
}
