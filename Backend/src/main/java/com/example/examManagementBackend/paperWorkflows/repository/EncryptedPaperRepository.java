package com.example.examManagementBackend.paperWorkflows.repository;


import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EncryptedPaperRepository extends JpaRepository<EncryptedPaper, Long> {
    EncryptedPaper findByFileName(String fileName);
    List<EncryptedPaper> findBySharedAtBefore(LocalDateTime date);
}

