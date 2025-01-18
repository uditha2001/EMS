package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.SubSubQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubSubQuestionRepository extends JpaRepository<SubSubQuestionEntity, Long> {
    // Additional query methods (if needed) can be added here.
}

