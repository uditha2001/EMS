package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;
import static com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus.PUBLISHED;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="published_Results")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PublishedAndReCorrectedResultsEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long publishedResultsId;
    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="examination_id",referencedColumnName = "id")
    private ExaminationEntity examination;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="course_id",referencedColumnName = "id")
    private CoursesEntity course;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="student_id",referencedColumnName = "studentId")
    private StudentsEntity student;

    private float finalMarks;

    private String grade;

    @Enumerated(EnumType.STRING)
    private ResultStatus status=PUBLISHED;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="approved_by",referencedColumnName = "userId")
    private UserEntity approvedBy;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime publishAt;
    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

}
