package com.example.examManagementBackend.paperWorkflows.repository;


import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EncryptedPaperRepository extends JpaRepository<EncryptedPaper, Long> {
    EncryptedPaper findByFileName(String fileName);
    List<EncryptedPaper> findBySharedAtBefore(LocalDateTime date);
    List<EncryptedPaper> findByExaminationId(Long examinationId);

    // Check if paper exists for course, examination and paper types
    boolean existsByCourseIdAndExaminationIdAndPaperTypeIn(
            Long courseId,
            Long examinationId,
            List<PaperType> paperTypes);

    // Find paper by course, examination and paper type
    Optional<EncryptedPaper> findByCourseIdAndExaminationIdAndPaperType(
            Long courseId,
            Long examinationId,
            PaperType paperType);

    // Find papers by course and examination
    List<EncryptedPaper> findByCourseIdAndExaminationId(Long courseId, Long examinationId);

    boolean existsByCourseIdAndExaminationIdAndPaperType(
            Long courseId,
            Long examinationId,
            PaperType paperType);

}

