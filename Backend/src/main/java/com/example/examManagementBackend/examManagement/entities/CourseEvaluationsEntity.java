package com.example.examManagementBackend.examManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="course_evaluation")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseEvaluationsEntity {
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
