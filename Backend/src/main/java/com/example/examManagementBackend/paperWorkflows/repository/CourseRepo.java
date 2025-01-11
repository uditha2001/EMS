package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface CourseRepo extends JpaRepository<Moderation, Long> {
@Autowired
List<Moderation> findAll();

    Optional<Moderation> findById(Long id);

    CoursesEntity save(CoursesEntity course);

    void deleteById(Long id);
}
