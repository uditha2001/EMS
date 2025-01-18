package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CoursesRepository extends JpaRepository<CoursesEntity, Long> {
    CoursesEntity findBycode(String code);
    @Query("SELECT ce FROM CoursesEntity ce WHERE ce.degreeProgramsEntity.id= :degreeId")
    CoursesEntity getdataByDegreeId(@Param("degreeId") Long degreeId);
}
