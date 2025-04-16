package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.TimeSlotChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotChangeLogRepository extends JpaRepository<TimeSlotChangeLog, Long> {
    List<TimeSlotChangeLog> findByExamTimeTable_Examination_Id(Long examinationId);
    List<TimeSlotChangeLog> findByExamTimeTable_Examination_IdIn(List<Long> examinationIds);
}
