package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface ExamTypeRepo extends JpaRepository<ExamTypesEntity,Long> {
    @Query("SELECT et.id FROM ExamTypesEntity et WHERE et.examType= :name")
    Long getExamTypeIdByExamTypeName(@Param("name") String examTypeName);

    @Query("SELECT et FROM ExamTypesEntity et where et.id = :id")
    ExamTypesEntity getUsingId( @Param("id") long id);
    @Query("SELECT et FROM ExamTypesEntity  et")
    List<ExamTypesEntity> getAllExamTypes();
    @Query("SELECT et FROM ExamTypesEntity et WHERE et.examType=:examType")
    ExamTypesEntity getExamTypeByName(@Param("examType") String examTypeName);

    Optional<ExamTypesEntity> findByExamType(String examType);
    @Query("SELECT et.examType FROM ExamTypesEntity et")
    List<ExamTypesEntity> getExamTypes();

    @Query("SELECT et FROM ExamTypesEntity et WHERE et.id=:examId")
    List<ExamTypesEntity> getExamTypesById(@Param("examId") long examId);

    @Modifying
    @Transactional
    @Query("DELETE FROM ExamTypesEntity et WHERE et.id = :examId")
    void deleteExamTypeById(@Param("examId") long examId);

    @Modifying
    @Transactional
    @Query("UPDATE ExamTypesEntity et SET et.examType = :name WHERE et.id = :id")
    void updateExamTypeById(@Param("id") long id,
                            @Param("name") String name
                           );




}
