package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamInvigilatorsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamInvigilatorsRepository extends JpaRepository<ExamInvigilatorsEntity, Long> {
}
