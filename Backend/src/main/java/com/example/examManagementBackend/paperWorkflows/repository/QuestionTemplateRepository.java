package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionTemplateRepository extends JpaRepository<QuestionTemplateEntity, Long> {
}
