package com.example.examManagementBackend.paperWorkflows.repo;

import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramCourseEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DegreeProgramRepo extends JpaRepository<DegreeProgramEntity, Integer> {
    Optional<DegreeProgramEntity> findById(int id);

    Optional<DegreeProgramEntity> findByName(String name);
}
