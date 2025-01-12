package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.ExamPaperEntity;
import com.example.examManagementBackend.paperWorkflows.entity.PapersCoursesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface PaperHandelingRepo extends JpaRepository<ExamPaperEntity, Long> {

}
