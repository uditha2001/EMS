package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CoursesRepository extends JpaRepository<CoursesEntity, Long> {
    CoursesEntity findBycode(String code);
    @Query("SELECT ce FROM CoursesEntity ce WHERE ce.degreeProgramsEntity.degreeName= :degreeName")
    List<CoursesEntity> getdataByDegreeName(@Param("degreeName") String degreeName);

    @Query("SELECT ce.id FROM CoursesEntity ce WHERE ce.code= :code")
    Long getCourseIdByCode(@Param("code") String code);

    @Query("SELECT c FROM CoursesEntity c WHERE c.id= :courseId")
    CoursesEntity findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT ce FROM CoursesEntity ce WHERE ce.code=:courseCode")
    CoursesEntity findByCourseCode(@Param("courseCode") String courseCode);

}
