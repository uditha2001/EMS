package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedBackDataEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String generalComment;
    @Column(columnDefinition = "TEXT")
    private String learningOutcomes;
    @Column(columnDefinition = "TEXT")
    private String courseContent;
    @Column(columnDefinition = "TEXT")
    private String degreeProgram;
    @Column(columnDefinition = "TEXT")
    private String courseCode;
    @Column(columnDefinition = "TEXT")
    private String courseName;
    @Column(columnDefinition = "TEXT")
    private String examination;
    @Column(columnDefinition = "TEXT")
    private String agreeAndAddressed;
    @Column(columnDefinition = "TEXT")
    private String notAgreeAndReasons;
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="exam_paper_id",referencedColumnName = "id")
    private ExamPaperEntity examPaperEntity;

}
