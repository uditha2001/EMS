package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.timetable.entities.ExamTimeTableCenter;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface ExaminationTimeTableRepository extends JpaRepository<ExamTimeTablesEntity,Long> {
    @Query("SELECT ett.course FROM ExamTimeTablesEntity ett WHERE ett.examTimeTableId= :id")
    CoursesEntity getCourseEntities(@Param("id") Long id);

    List<ExamTimeTablesEntity> findByExaminationId(Long examinationId);
    @Query("SELECT DISTINCT ett.examType.id FROM ExamTimeTablesEntity ett WHERE ett.course.code=:courseCode AND ett.examination.id=:id")
    List<Long> getExamTypesId(@Param("courseCode") String courseCode, @Param("id") Long id);

    List<ExamTimeTablesEntity> findByExaminationIdIn(List<Long> examinationIds);

    // Find exams using the same exam center at the same time slot
    @Query("SELECT e FROM ExamTimeTablesEntity e JOIN e.examCenters c WHERE c.examCenter.id = :examCenterId AND e.date = :date AND ((e.startTime < :endTime) AND (e.endTime > :startTime))")
    List<ExamTimeTablesEntity> findByExamTimeTableCenterAndOverlappingTimeSlot(
            @Param("examCenterId") Long examCenterId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Find exams using the same invigilator at the same time slot
    @Query("SELECT e FROM ExamTimeTablesEntity e JOIN ExamInvigilatorsEntity ei ON e.examTimeTableId = ei.examTimeTables.examTimeTableId WHERE ei.invigilators.userId = :invigilatorId AND e.date = :date AND ((e.startTime < :endTime) AND (e.endTime > :startTime))")
    List<ExamTimeTablesEntity> findByInvigilatorAndOverlappingTimeSlot(
            @Param("invigilatorId") Long invigilatorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Find exams using the same supervisor at the same time slot
    @Query("SELECT e FROM ExamTimeTablesEntity e JOIN e.examCenters c WHERE c.supervisor.userId = :supervisorId AND e.date = :date AND ((e.startTime < :endTime) AND (e.endTime > :startTime))")
    List<ExamTimeTablesEntity> findBySupervisorAndOverlappingTimeSlot(
            @Param("supervisorId") Long supervisorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Add to ExaminationTimeTableRepository
    @Query("SELECT e FROM ExamTimeTablesEntity e " +
            "WHERE e.examination.degreeProgramsEntity.degreeName = :degreeName " +
            "AND e.examination.year = :year " +
            "AND e.date = :date " +
            "AND ((e.startTime < :endTime AND e.endTime > :startTime)) " +
            "AND e.examTimeTableId != :excludeId")
    List<ExamTimeTablesEntity> findByExaminationDegreeAndYearAndOverlappingTime(
            @Param("degreeName") String degreeName,
            @Param("year") String year,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);

    @Query("SELECT DISTINCT e FROM ExamTimeTablesEntity e " +
            "JOIN e.examCenters c " +
            "WHERE c.examCenter.id = :centerId " +
            "AND e.date = :date " +
            "AND ((e.startTime < :endTime AND e.endTime > :startTime)) " +
            "AND e.examTimeTableId != :excludeId")
    List<ExamTimeTablesEntity> findByExamCenterAndOverlappingTime(
            @Param("centerId") Long centerId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);

    @Query("SELECT e FROM ExamTimeTablesEntity e " +
            "WHERE EXISTS (SELECT 1 FROM ExamInvigilatorsEntity i " +
            "WHERE i.examTimeTables.examTimeTableId = e.examTimeTableId " +
            "AND i.invigilators.userId = :invigilatorId) " +
            "AND e.date = :date " +
            "AND ((e.startTime < :endTime AND e.endTime > :startTime)) " +
            "AND e.examTimeTableId != :excludeId")
    List<ExamTimeTablesEntity> findByInvigilatorAndOverlappingTime(
            @Param("invigilatorId") Long invigilatorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);

    List<ExamTimeTablesEntity> findByCourseIdAndExaminationIdAndApprovedTrue(Long courseId, Long examinationId);

    // Find distinct course IDs for a given examination and exam types
    @Query("SELECT DISTINCT e.course.id FROM ExamTimeTablesEntity e " +
            "WHERE e.examination.id = :examinationId " +
            "AND e.examType.examType IN :examTypes")
    List<Long> findDistinctCourseIdsByExaminationIdAndExamTypeIn(
            @Param("examinationId") Long examinationId,
            @Param("examTypes") List<String> examTypes);


}
