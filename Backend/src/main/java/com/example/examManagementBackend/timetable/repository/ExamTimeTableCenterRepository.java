package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamTimeTableCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamTimeTableCenterRepository extends JpaRepository<ExamTimeTableCenter, Long> {

    Optional<ExamTimeTableCenter> findByExamTimeTableExamTimeTableIdAndExamCenterId(Long examTimeTableId, Long examCenterId);
    void deleteBySupervisorUserId(Long supervisorId);
}
