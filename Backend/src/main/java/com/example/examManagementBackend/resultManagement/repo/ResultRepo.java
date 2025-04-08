package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
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
public interface ResultRepo extends JpaRepository<ResultEntity, Long> {
    @Query("SELECT COUNT(r) FROM ResultEntity r WHERE r.examination.id = :examId " +
            "AND r.course.id = :courseId " +
            "AND r.examType.id = :examTypeId " +
            "AND r.student.studentId = :studentId")
    Integer isEmpty(@Param("examId") Long examId,
                    @Param("studentId") Long studentId,
                    @Param("examTypeId") Long examTypeId,
                    @Param("courseId") Long courseId);

    @Query("SELECT r.resultId FROM ResultEntity r WHERE r.examination.id = :examId " +
            "AND r.course.id = :courseId " +
            "AND r.examType.id = :examTypeId " +
            "AND r.student.studentId = :studentId")
    Long getResultIdIfExists(@Param("examId") Long examId,
                             @Param("studentId") Long studentId,
                             @Param("examTypeId") Long examTypeId,
                             @Param("courseId") Long courseId);
    @Modifying
    @Transactional
    @Query("UPDATE ResultEntity r SET r.firstMarking = :firstMarking, " +
            "r.approvedBy = :approvedBy,r.status=:status " +
            "WHERE r.resultId = :id")
    void updateFirstMarkingResults(@Param("firstMarking") float firstMarking,
                       @Param("approvedBy") UserEntity approvedBy,
                       @Param("id") Long id,@Param("status") ResultStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE ResultEntity r SET r.secondMarking = :secondMarking, " +
            "r.approvedBy = :approvedBy,r.status=:status " +
            "WHERE r.resultId = :id")
    void updateSecondMarkingResults(@Param("secondMarking") float secondMarking,
                       @Param("approvedBy") UserEntity approvedBy,
                       @Param("id") Long id,@Param("status") ResultStatus status);

    @Query("SELECT r FROM ResultEntity r WHERE r.course.id= :courseId AND r.examination.id= :examId AND r.examType.id= :examTypeId AND r.status=:status")
    List<ResultEntity> getFirstMarkingResults(@Param("courseId") Long courseId, @Param("examId") Long examId, @Param("examTypeId") Long examTypeId, @Param("status") ResultStatus status);

    @Query("SELECT r FROM ResultEntity r WHERE r.course.code=:courseCode AND r.examination.id=:examID AND r.status=:status")
    List<ResultEntity> getStudentResultsByCourseCodeAndExamId (@Param("courseCode") String courseCode, @Param("examID") Long examID, @Param("status") ResultStatus status);
    @Query("SELECT DISTINCT r.examType.examType FROM ResultEntity r WHERE r.course.code=:courseCode AND r.examination.id=:examId AND r.status=:status")
    List<String> getExamTypeName(@Param("courseCode") String courseCode, @Param("examId") Long examID, @Param("status") ResultStatus status);
    @Modifying
    @Transactional
    @Query("UPDATE ResultEntity r SET r.status=:status,r.finalMarks=:marks,r.approvedBy=:approvedby WHERE r.resultId=:id")
    void updatePublishedResults(@Param("status") ResultStatus status,@Param("marks") Float marks,@Param("approvedby") UserEntity approvedBy,@Param("id") Long id);

    @Query("SELECT r FROM ResultEntity r WHERE r.examination=:examination AND r.course=:course AND r.examType.examType=:examType")
    List<ResultEntity> findByExaminationAndCourseAndExamType(
            ExaminationEntity examination,
            CoursesEntity course,
            String examType
    );

}
