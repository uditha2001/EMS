package com.example.examManagementBackend.timetable.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface ExaminationTimeTableRepository extends JpaRepository<ExamTimeTablesEntity,Long> {
    @Query("SELECT ett.course FROM ExamTimeTablesEntity ett WHERE ett.examTimeTableId= :id")
    CoursesEntity getCourseEntities(@Param("id") Long id);

    List<ExamTimeTablesEntity> findByExaminationId(Long examinationId);
}
