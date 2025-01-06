package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.extern.apachecommons.CommonsLog;

import java.sql.Timestamp;
import java.time.Instant;

@Entity
@Data
@Table(name = "degree_program_course")
public class DegreeProgramCourseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String code;
    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "degree_program_id")
    private DegreeProgramEntity degreeProgram;

    private int semester;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @PrePersist
    protected void onCreate() {
        Timestamp now = Timestamp.from(Instant.now());
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Timestamp.from(Instant.now());
    }
}
