package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CourseEvaluationRepo extends JpaRepository<CourseEvaluationsEntity,Long> {
    @Query("SELECT ce FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode")
    public List<CourseEvaluationsEntity> getAllByCourseCode(@Param("courseCode") String courseCode);
}
