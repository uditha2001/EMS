// ExamCentersRepository
package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamCentersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamCentersRepository extends JpaRepository<ExamCentersEntity, Long> {
}
