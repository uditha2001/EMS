package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<ExaminationEntity, Long> {
    @Query("SELECT e FROM ExaminationEntity e " +
            "WHERE (:year IS NULL OR e.year = :year) " +
            "AND (:semester IS NULL OR e.semester = :semester) " +
            "AND (:level IS NULL OR e.level = :level)")
    List<ExaminationEntity> findByFilters(String year, String semester, String level);
}
