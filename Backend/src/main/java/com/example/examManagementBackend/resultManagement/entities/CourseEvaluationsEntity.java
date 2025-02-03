package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="course_evaluation")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseEvaluationsEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseEvaluationId;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="course_id", nullable=false,referencedColumnName = "id")
    private CoursesEntity courses;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="exam_type",referencedColumnName = "id")
    private ExamTypesEntity examTypes;
    private float weightage;

}
