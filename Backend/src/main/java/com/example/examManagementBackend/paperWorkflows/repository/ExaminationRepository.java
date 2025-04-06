package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<ExaminationEntity, Long> {
    @Query("SELECT e FROM ExaminationEntity e " +
            "WHERE (:year IS NULL OR e.year = :year) " +
            "AND (:semester IS NULL OR e.semester = :semester) " +
            "AND (:level IS NULL OR e.level = :level)")
    List<ExaminationEntity> findByFilters(String year, String semester, String level);

    @Query("SELECT e.examTimeTables FROM ExaminationEntity e WHERE e.id= :examinationId")
    List<ExamTimeTablesEntity> getCoursesUsingExaminationId(@Param("examinationId") Long examinationId);

    @Query("SELECT e FROM ExaminationEntity e WHERE e.status=:status AND e.id=:id")
    ExaminationEntity findAllOngoingExamsWithId(@Param("status") ExamStatus status, @Param("id") Long id);

    @Query("SELECT e FROM ExaminationEntity e WHERE SIZE(e.examTimeTables) > 0")
    List<ExaminationEntity> findExaminationsWithTimetable();

    @Query("SELECT COUNT(e) FROM ExaminationEntity e WHERE e.status = :status")
    Long countByStatus(ExamStatus status);
    @Query("SELECT e FROM ExaminationEntity e WHERE e.id=:id")
    ExaminationEntity findExaminationById(@Param("id") Long id);



}
