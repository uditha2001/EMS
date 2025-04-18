package com.example.examManagementBackend.resultManagement.repo;


import com.example.examManagementBackend.resultManagement.entities.PublishedAndReCorrectedResultsEntity;
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
    @Query("SELECT pac FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id=:id")
    List<PublishedAndReCorrectedResultsEntity> getAllResults(@Param("id") Long id);
    @Query("SELECT pac FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id=:id AND pac.course.code=:code")
    List<PublishedAndReCorrectedResultsEntity> getAllResultsByCode(@Param("id") Long id, @Param("code") String code);

    @Query("SELECT pac FROM PublishedAndReCorrectedResultsEntity pac " +
            "WHERE pac.examination.degreeProgramsEntity.id = :id " +
            "AND pac.course.code = :code " +
            "AND FUNCTION('YEAR', pac.publishAt) = :year")
    List<PublishedAndReCorrectedResultsEntity> findByProgramIdAndCourseCodeAndPublishedYear(
            @Param("id") Long id,
            @Param("code") String code,
            @Param("year") int year
    );
    @Query("SELECT pac FROM PublishedAndReCorrectedResultsEntity pac WHERE pac.examination.degreeProgramsEntity.id=:id AND FUNCTION('YEAR',pac.publishAt)=:year ")
    List<PublishedAndReCorrectedResultsEntity> findByProgramIdAndYear(@Param("id") Long id, @Param("year") int year);
    @Query("SELECT pac FROM PublishedAndReCorrectedResultsEntity pac")
    List<PublishedAndReCorrectedResultsEntity> findAll();

}
