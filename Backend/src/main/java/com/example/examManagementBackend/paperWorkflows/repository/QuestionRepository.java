package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByModerationId(Long moderationId);
}
