package com.example.examManagementBackend.resultManagement.repo;


import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.PublishedResultsEntity;
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

    @Query("SELECT distinct pac.examination FROM PublishedResultsEntity pac WHERE pac.status=:status")
    List<ExaminationEntity> getAllExaminations(@Param("status") ResultStatus status);
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

    //verify the particular data is already include or not
    @Query("SELECT pr.publishedResultsId FROM PublishedResultsEntity pr WHERE pr.examination.id = :examId " +
            "AND pr.course.code = :courseCode " +
            "AND pr.student.studentNumber = :studentNumber")
    Long getPublishedResultIdIfExists(@Param("examId") Long examId,
                             @Param("studentNumber") String studentNumber,
                             @Param("courseCode") String courseCode);
    //update already existing recode
    @Repository
    public interface PublishedResultsRepository extends JpaRepository<PublishedResultsEntity, Long> {

        @Query("SELECT pr.publishedResultsId FROM PublishedResultsEntity pr WHERE pr.examination.id = :examId " +
                "AND pr.course.id = :courseId AND pr.student.studentId = :studentId")
        Long getPublishedResultIdIfExists(@Param("examId") Long examId,
                                          @Param("studentId") Long studentId,
                                          @Param("courseId") Long courseId);


    }


}
