package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionModerationStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.QuestionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SubSubQuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sub_question_id", nullable = false)
    private SubQuestionEntity subQuestion;

    private int subSubQuestionNumber;

    private int marks; // Marks for this sub-subquestion

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType; // Type of sub-subquestion

    @Column(columnDefinition = "TEXT")
    private String moderatorComment; // Moderator's comments

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;
}
