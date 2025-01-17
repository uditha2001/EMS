package com.example.examManagementBackend.paperWorkflows.entity;

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
        name = "question_structure",
        uniqueConstraints = @UniqueConstraint(columnNames = {"encrypted_paper_id", "questionNumber"})
)
public class QuestionStructureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "encrypted_paper_id", nullable = false)
    private EncryptedPaper encryptedPaper;

    @Column(nullable = false)
    private int questionNumber;

    private int totalMarks; // Total marks for the main question

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType; // Type of question (Essay, MCQ, etc.)

    @Column(columnDefinition = "TEXT")
    private String moderatorComment; // Moderator's comments

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionModerationStatus status = QuestionModerationStatus.PENDING;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "questionStructure")
    private List<SubQuestionEntity> subQuestions;
}
