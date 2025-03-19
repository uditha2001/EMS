package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CourseEvaluationRepo extends JpaRepository<CourseEvaluationsEntity,Long> {
    @Query("SELECT ce FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode")
    public List<CourseEvaluationsEntity> getAllByCourseCode(@Param("courseCode") String courseCode);

    @Query("SELECT count(ce) FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode AND ce.examTypes.name=:type")
    public Integer countByCourseCodeAndExamType(@Param("courseCode") String courseCode, @Param("type") ExamTypesName type);

    @Query("SELECT count(ce) FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode AND ce.examTypes.id=:id")
    public Integer countByCourseCodeAndExamTypeId(@Param("courseCode") String courseCode, @Param("id") Long id);



    @Transactional
    @Modifying
    @Query("UPDATE CourseEvaluationsEntity ce " +
            "SET ce.passMark = :newPassMark, ce.weightage = :newWeightage " +
            "WHERE ce.courses.code = :courseCode AND ce.examTypes.name = :type")
    void updateByCourseCodeAndExamType(@Param("newPassMark") float newPassMark,
                                       @Param("newWeightage") float newWeightage,
                                       @Param("courseCode") String courseCode,
                                       @Param("type") ExamTypesName type);
    @Query("SELECT ce.passMark FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode AND ce.examTypes.name=:name ")
    float getPassMarkByCourseCodeAndCourseEvaluationId(String courseCode, ExamTypesName name);
    @Query("SELECT ce.weightage FROM CourseEvaluationsEntity ce WHERE ce.courses.code=:courseCode AND ce.examTypes.name=:name ")
    float getWeightageByCourseCodeAndCourseEvaluationId(String courseCode, ExamTypesName name);

    @Query("SELECT ce FROM CourseEvaluationsEntity ce WHERE ce.courses = :course AND ce.examTypes.id = :examTypeId")
    CourseEvaluationsEntity findByCoursesAndExamTypes(@Param("course") CoursesEntity course, @Param("examTypeId") Long examTypeId);

    @Query("SELECT ce FROM CourseEvaluationsEntity ce WHERE ce.courses.id = :courseId")
    List<CourseEvaluationsEntity> findByCourseId(@Param("courseId") Long courseId);


}
