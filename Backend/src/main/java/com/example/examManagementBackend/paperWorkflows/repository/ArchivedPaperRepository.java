package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.ArchivedPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchivedPaperRepository extends JpaRepository<ArchivedPaper, Long>, JpaSpecificationExecutor<ArchivedPaper> {
}

