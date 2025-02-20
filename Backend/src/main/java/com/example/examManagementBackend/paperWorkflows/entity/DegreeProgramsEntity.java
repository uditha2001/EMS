package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Table(name = "degree_programs")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DegreeProgramsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false,unique = true)
    private String degreeName;
    @Column(columnDefinition = "TEXT")
    private String degreeDescription;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "degreeProgramsEntity",cascade = CascadeType.ALL)
    private List<CoursesEntity> coursesEntities;
    @OneToMany(mappedBy = "degreeProgramsEntity",cascade = CascadeType.ALL)
    private List<ExaminationEntity> academicYearsEntities;

    public DegreeProgramsEntity(Long id) {
        this.id = id;
    }
}
