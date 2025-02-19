package com.example.examManagementBackend.resultManagement.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
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
    @ManyToMany(cascade=CascadeType.ALL,mappedBy = "centers")
    private Set<ExamTimeTablesEntity> examTimeTables;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;


}
