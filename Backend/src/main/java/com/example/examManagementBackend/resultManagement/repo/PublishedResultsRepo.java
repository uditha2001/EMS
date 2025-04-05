package com.example.examManagementBackend.resultManagement.repo;


import com.example.examManagementBackend.resultManagement.entities.PublishedAndReCorrectedResultsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;

@Repository
@EnableJpaRepositories
public interface PublishedResultsRepo extends JpaRepository<PublishedAndReCorrectedResultsEntity, Long> {

}
