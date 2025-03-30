package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.timetable.entities.ExamTimeTableCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamTimeTableCenterRepository extends JpaRepository<ExamTimeTableCenter, Long> {

    Optional<ExamTimeTableCenter> findByExamTimeTableExamTimeTableIdAndExamCenterId(Long examTimeTableId, Long examCenterId);

    void deleteBySupervisorUserId(Long supervisorId);

    @Query("SELECT etc FROM ExamTimeTableCenter etc WHERE etc.examTimeTable.examTimeTableId = :examTimeTableId")
    List<ExamTimeTableCenter> findByExamTimeTableExamTimeTableId(Long examTimeTableId);


}