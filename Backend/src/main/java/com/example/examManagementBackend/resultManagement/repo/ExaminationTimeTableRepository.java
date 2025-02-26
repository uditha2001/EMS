package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
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

    @Query("SELECT DISTINCT ett.examType.id FROM ExamTimeTablesEntity ett WHERE ett.course.code=:courseCode AND ett.examination.id=:id")
    List<Long> getExamTypesId(@Param("courseCode") String courseCode, @Param("id") Long id);
}
