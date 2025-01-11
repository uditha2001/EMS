package com.example.examManagementBackend.paperWorkflows.repository;


import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncryptedPaperRepository extends JpaRepository<EncryptedPaper, Long> {
    EncryptedPaper findByFileName(String fileName);
}

