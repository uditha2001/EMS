package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface ExamTypeRepo extends JpaRepository<ExamTypesEntity,Long> {
    @Query("SELECT et.id FROM ExamTypesEntity et WHERE et.name= :name")
    Long getExamTypeIdByExamTypeName(@Param("name") ExamTypesName examTypeName);

    @Query("SELECT et FROM ExamTypesEntity et where et.id = :id")
    ExamTypesEntity getUsingId( @Param("id") long id);
    @Query("SELECT et FROM ExamTypesEntity  et")
    List<ExamTypesEntity> getAllExamTypes();
    @Query("SELECT et FROM ExamTypesEntity et WHERE et.name=:examType")
    ExamTypesEntity getExamTypeByName(@Param("examType") ExamTypesName examTypeName);
}
