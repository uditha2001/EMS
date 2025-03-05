package com.example.examManagementBackend.timetable.entities;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="exam_centers")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ExamCentersEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String examCenterName;

    @Column(columnDefinition = "TEXT")
    private String examCenterLocation;

    @Column(nullable = false)
    private Integer examCenterCapacity;

    private String contactPerson;

    // One Exam Center has many Invigilators
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "examCenter")
    private Set<ExamInvigilatorsEntity> examInvigilatorsEntities;

    @OneToMany(mappedBy = "examCenter", cascade = CascadeType.ALL)
    private Set<ExamTimeTableCenter> examTimeTables = new HashSet<>();

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
}
