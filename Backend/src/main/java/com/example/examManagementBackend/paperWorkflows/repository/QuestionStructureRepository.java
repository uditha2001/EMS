package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.QuestionStructureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionStructureRepository extends JpaRepository<QuestionStructureEntity, Long> {
    List<QuestionStructureEntity> findByEncryptedPaperId(Long paperId);
    List<QuestionStructureEntity> findByTemplateId(Long templateId);

}

