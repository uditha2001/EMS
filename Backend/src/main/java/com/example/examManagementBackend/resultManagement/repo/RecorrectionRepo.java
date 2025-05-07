package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.RecorrectionEntity;
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
public interface RecorrectionRepo extends JpaRepository<RecorrectionEntity, Long> {
    //verify the particular data is already include or not
    @Query("SELECT r.recorrectionId FROM RecorrectionEntity r WHERE r.examination.id = :examId " +
            "AND r.course.id = :courseId " +
            "AND r.student.studentNumber = :studentNumber")
    Long getRecorectedResultIdIfExists(@Param("examId") Long examId,
                                      @Param("studentNumber") String studentNumber,
                                      @Param("courseId") Long courseId);
    @Modifying
    @Transactional
    @Query("UPDATE RecorrectionEntity r SET r.newMarks = :newMarks, r.newGrade = :newGrade, r.Reason = :reason, " +
            "r.approvedBy = :approvedBy WHERE r.examination.id = :examId AND r.course.id = :courseId AND r.student.studentId = :studentId")
    int updateRecorrectionResult(@Param("examId") Long examId,
                                 @Param("courseId") Long courseId,
                                 @Param("studentId") Long studentId,
                                 @Param("newMarks") float newMarks,
                                 @Param("newGrade") String newGrade,
                                 @Param("reason") String reason,
                                 @Param("approvedBy") UserEntity approvedBy);


}
