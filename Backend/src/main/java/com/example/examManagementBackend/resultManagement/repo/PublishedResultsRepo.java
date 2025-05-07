package com.example.examManagementBackend.resultManagement.repo;


import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.PublishedResultsEntity;
import com.example.examManagementBackend.resultManagement.entities.StudentsEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface PublishedResultsRepo extends JpaRepository<PublishedResultsEntity, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM PublishedResultsEntity pac WHERE pac.createdAt < :eightYearsAgo")
    void deletePublishedResultsOlderThanEightYears(@Param("eightYearsAgo") LocalDateTime eightYearsAgo);

    @Query("SELECT DISTINCT p.course.code FROM PublishedResultsEntity p WHERE p.examination.degreeProgramsEntity.id=:id")
    List<String> getAllCourses(@Param("id") Long id);
    @Query("SELECT DISTINCT FUNCTION('YEAR', pac.publishAt) FROM PublishedResultsEntity pac ORDER BY FUNCTION('YEAR', pac.publishAt)")
    List<String> getAllYears();
    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id = :id")
    List<DataForCalCulationDTO> getAllResults(@Param("id") Long id);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks,pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id = :id AND pac.course.code = :code")
    List<DataForCalCulationDTO> getAllResultsByCode(@Param("id") Long id, @Param("code") String code);


    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedResultsEntity pac " +
            "WHERE pac.examination.degreeProgramsEntity.id = :id " +
            "AND pac.course.code = :code " +
            "AND FUNCTION('YEAR', pac.publishAt) = :year")
    List<DataForCalCulationDTO> findByProgramIdAndCourseCodeAndPublishedYear(@Param("id") Long id, @Param("code") String code, @Param("year") int year);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedResultsEntity pac " +
            "WHERE pac.examination.degreeProgramsEntity.id = :id " +
            "AND FUNCTION('YEAR', pac.publishAt) = :year")
    List<DataForCalCulationDTO> findByProgramIdAndYear(@Param("id") Long id, @Param("year") int year);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO( pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedResultsEntity pac")
    List<DataForCalCulationDTO> findAllResults();

    @Query("SELECT pac.student FROM PublishedResultsEntity pac where pac.course.code=:courseCode AND pac.examination.id=:id AND pac.grade=:grade")
    List<StudentsEntity> getAllAbsentStudents(@Param("courseCode") String courseCode, @Param("id") Long id, @Param("grade") String grade);
    @Modifying
    @Transactional
    @Query("UPDATE PublishedResultsEntity pac SET pac.grade = :grade, pac.approvedBy.username = :user " +
            "WHERE pac.examination.id = :id AND pac.course.code = :code AND pac.student.studentNumber = :number")
    void updateMedical(@Param("user") String user,
                       @Param("grade") String grade,
                       @Param("id") Long examinationId,
                       @Param("code") String courseCode,
                       @Param("number") String studentNumber);


    @Query("SELECT pac.examination FROM PublishedResultsEntity pac")
    List<ExaminationEntity> getAllExaminations();
    @Modifying
    @Transactional
    @Query("UPDATE PublishedResultsEntity pac SET pac.status = :status,pac.approvedBy=:user,pac.finalMarks=:marks,pac.grade=:grade " +
            "WHERE pac.course.code = :code AND pac.examination.id = :examId AND pac.student.studentNumber = :studentNumber")
    void updateStatusByCourseAndExamAndStudent(
            @Param("status") ResultStatus status,
            @Param("user") UserEntity user,
            @Param("marks") Float marks,
            @Param("grade") String grade,
            @Param("code") String courseCode,
            @Param("examId") Long examId,
            @Param("studentNumber") String studentNumber);

}
