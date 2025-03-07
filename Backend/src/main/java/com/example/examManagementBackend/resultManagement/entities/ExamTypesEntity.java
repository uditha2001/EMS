package com.example.examManagementBackend.resultManagement.entities;

import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Table(name="exam_types")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ExamTypesEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String examType;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "examType")
    private List<ExamTimeTablesEntity> examTimeTables;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "examTypes")
    private Set<CourseEvaluationsEntity> courseEvaluations;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "examType")
    private Set<ResultEntity> results;

}
