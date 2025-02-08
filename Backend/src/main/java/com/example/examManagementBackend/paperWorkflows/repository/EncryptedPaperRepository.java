package com.example.examManagementBackend.paperWorkflows.repository;


import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EncryptedPaperRepository extends JpaRepository<EncryptedPaper, Long> {
    EncryptedPaper findByFileName(String fileName);
    List<EncryptedPaper> findBySharedAtBefore(LocalDateTime date);

}

