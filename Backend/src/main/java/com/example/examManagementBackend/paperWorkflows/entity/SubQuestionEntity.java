package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(
        name = "sub_question_structure",
        uniqueConstraints = @UniqueConstraint(columnNames = {"question_structure_id", "subQuestionNumber"})
)
public class SubQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_structure_id", nullable = false)
    private QuestionStructureEntity questionStructure;

    private int subQuestionNumber;

    private float marks; // Marks for this subquestion

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType; // Type of subquestion

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String moderatorComment; // Moderator's comments

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subQuestion")
    private List<SubSubQuestionEntity> subSubQuestions;
}
