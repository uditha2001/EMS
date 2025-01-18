package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionStructureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionStructureRepository extends JpaRepository<QuestionStructureEntity, Long> {
    // Additional query methods (if needed) can be added here.
}

