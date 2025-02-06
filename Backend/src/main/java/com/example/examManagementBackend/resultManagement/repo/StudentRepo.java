package com.example.examManagementBackend.resultManagement.repo;

import com.example.examManagementBackend.resultManagement.entities.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@EnableJpaRepositories
public interface StudentRepo extends JpaRepository<StudentsEntity,Long> {
        @Query("SELECT s.studentId FROM StudentsEntity s WHERE s.studentNumber= :number")
        Long getIdBystudentNumber(@Param("number") String studentNumber);

        @Query("SELECT COUNT(s) FROM StudentsEntity s WHERE s.studentNumber = :studentNumber")
        Integer IsEmpty(@Param("studentNumber") String studentNumber);

        @Query("SELECT s FROM StudentsEntity s WHERE s.studentNumber=:studentNumber")
        StudentsEntity findByStudentNumber(@Param("studentNumber") String studentNumber);

}
