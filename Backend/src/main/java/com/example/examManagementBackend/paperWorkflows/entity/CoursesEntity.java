package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Table(name = "courses")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoursesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(columnDefinition = "TEXT")
    @Size(max = 40000)
    private String description;
    @Column(nullable = false)
    private Integer level;
    @Column(nullable = false)
    private int semester;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="degree_program_id",referencedColumnName = "id",nullable = false)
    private DegreeProgramsEntity degreeProgramsEntity;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "course")
    private List<ExamPaperEntity> examPaperEntityList;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "course")
    private List<PapersCoursesEntity> papersCoursesEntityList;


}
