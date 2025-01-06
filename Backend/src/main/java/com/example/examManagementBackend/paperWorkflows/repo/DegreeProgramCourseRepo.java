package com.example.examManagementBackend.paperWorkflows.repo;

import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramCourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DegreeProgramCourseRepo extends JpaRepository<DegreeProgramCourseEntity, Integer> {
    List<DegreeProgramCourseEntity> findByDegreeProgramId(int degreeProgramId);
}
