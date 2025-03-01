package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.SubQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubQuestionRepository extends JpaRepository<SubQuestionEntity, Long> {
    List<SubQuestionEntity> findByQuestionStructure_Id(Long questionStructureId);

}
