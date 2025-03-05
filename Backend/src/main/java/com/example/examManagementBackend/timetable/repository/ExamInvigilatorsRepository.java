package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamInvigilatorsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamInvigilatorsRepository extends JpaRepository<ExamInvigilatorsEntity, Long> {
    Optional<ExamInvigilatorsEntity> findByExamTimeTablesExamTimeTableIdAndExamCenterIdAndInvigilatorsUserId(
            Long examTimeTableId, Long examCenterId, Long invigilatorId);

}
