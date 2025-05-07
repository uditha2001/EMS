package com.example.examManagementBackend.resultManagement.repo;


import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import com.example.examManagementBackend.resultManagement.entities.PublishedAndReCorrectedResultsEntity;
import com.example.examManagementBackend.resultManagement.entities.StudentsEntity;
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
public interface PublishedResultsRepo extends JpaRepository<PublishedAndReCorrectedResultsEntity, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.createdAt < :eightYearsAgo")
    void deletePublishedResultsOlderThanEightYears(@Param("eightYearsAgo") LocalDateTime eightYearsAgo);

    @Query("SELECT DISTINCT p.course.code FROM PublishedAndReCorrectedResultsEntity p WHERE p.examination.degreeProgramsEntity.id=:id")
    List<String> getAllCourses(@Param("id") Long id);
    @Query("SELECT DISTINCT FUNCTION('YEAR', pac.publishAt) FROM PublishedAndReCorrectedResultsEntity pac ORDER BY FUNCTION('YEAR', pac.publishAt)")
    List<String> getAllYears();
    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id = :id")
    List<DataForCalCulationDTO> getAllResults(@Param("id") Long id);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks,pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id = :id AND pac.course.code = :code")
    List<DataForCalCulationDTO> getAllResultsByCode(@Param("id") Long id, @Param("code") String code);


    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedAndReCorrectedResultsEntity pac " +
            "WHERE pac.examination.degreeProgramsEntity.id = :id " +
            "AND pac.course.code = :code " +
            "AND FUNCTION('YEAR', pac.publishAt) = :year")
    List<DataForCalCulationDTO> findByProgramIdAndCourseCodeAndPublishedYear(@Param("id") Long id, @Param("code") String code, @Param("year") int year);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO(pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedAndReCorrectedResultsEntity pac " +
            "WHERE pac.examination.degreeProgramsEntity.id = :id " +
            "AND FUNCTION('YEAR', pac.publishAt) = :year")
    List<DataForCalCulationDTO> findByProgramIdAndYear(@Param("id") Long id, @Param("year") int year);

    @Query("SELECT DISTINCT new com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO( pac.finalMarks, pac.grade,pac.publishAt,pac.course.code) " +
            "FROM PublishedAndReCorrectedResultsEntity pac")
    List<DataForCalCulationDTO> findAllResults();

    @Query("SELECT pac.student FROM PublishedAndReCorrectedResultsEntity pac where pac.course.code=:courseCode AND pac.examination.id=:id AND pac.grade=:grade")
    List<StudentsEntity> getAllAbsentStudents(@Param("courseCode") String courseCode, @Param("id") Long id, @Param("grade") String grade);
    @Modifying
    @Transactional
    @Query("UPDATE PublishedAndReCorrectedResultsEntity pac SET pac.grade = :grade, pac.approvedBy.username = :user " +
            "WHERE pac.examination.id = :id AND pac.course.code = :code AND pac.student.studentNumber = :number")
    void updateMedical(@Param("user") String user,
                       @Param("grade") String grade,
                       @Param("id") Long examinationId,
                       @Param("code") String courseCode,
                       @Param("number") String studentNumber);



}
