package com.example.examManagementBackend.paperWorkflows.repository;


import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerationRepository extends JpaRepository<Moderation, Long> {
}
