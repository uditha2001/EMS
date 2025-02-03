package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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
            "r.approvedBy = :approvedBy " +
            "WHERE r.resultId = :id")
    void updateResults(@Param("firstMarking") float firstMarking,
                       @Param("approvedBy") UserEntity approvedBy,
                       @Param("id") Long id);

}
