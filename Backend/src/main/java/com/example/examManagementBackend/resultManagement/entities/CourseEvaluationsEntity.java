package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="course_evaluation")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CourseEvaluationsEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseEvaluationId;
    private float passMark=40;
    @ManyToOne
    @JoinColumn(name="course_id", nullable=false,referencedColumnName = "id")
    private CoursesEntity courses;
    @ManyToOne
    @JoinColumn(name="exam_type",referencedColumnName = "id")
    private ExamTypesEntity examTypes;
    private float weightage=40;

}
