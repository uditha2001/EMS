package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.SubSubQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubSubQuestionRepository extends JpaRepository<SubSubQuestionEntity, Long> {
    List<SubSubQuestionEntity> findBySubQuestionId(Long subQuestionId);
}

