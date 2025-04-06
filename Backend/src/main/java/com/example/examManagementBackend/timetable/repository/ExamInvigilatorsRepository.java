package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamInvigilatorsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ExamInvigilatorsRepository extends JpaRepository<ExamInvigilatorsEntity, Long> {

    Optional<ExamInvigilatorsEntity> findByExamTimeTablesExamTimeTableIdAndExamCenterIdAndInvigilatorsUserId(
            Long examTimeTableId, Long examCenterId, Long invigilatorId);

    @Query("SELECT ei FROM ExamInvigilatorsEntity ei WHERE ei.examTimeTables.examTimeTableId = :examTimeTableId AND ei.examCenter.id = :examCenterId")
    List<ExamInvigilatorsEntity> findByExamTimeTablesExamTimeTableIdAndExamCenterId(
            @Param("examTimeTableId") Long examTimeTableId,
            @Param("examCenterId") Long examCenterId);

    List<ExamInvigilatorsEntity> findByExamTimeTablesExamTimeTableId(Long examTimeTableId);

}