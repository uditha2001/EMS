package com.example.examManagementBackend.resultManagement.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="students_details")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StudentsEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;
    @Column(unique = true, nullable = false)
    private String studentNumber;
    @Column(nullable = false)
    private String studentName;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "student")
    private List<ResultEntity> results;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "student")
    private List<PublishedResultsEntity> publishedResultsEntities;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "student")
    private List<RecorrectionEntity> recorrectionEntities;

}
