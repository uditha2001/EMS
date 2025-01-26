package com.example.examManagementBackend.paperWorkflows.entity.moderatorFeedbacks;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@Table(name="questionFeedbackData")
@AllArgsConstructor
@NoArgsConstructor
public class QuestionFeedBackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String question;
    @Column(columnDefinition = "TEXT")
    private String answer;
    @ManyToOne(cascade = CascadeType.ALL)
    private FeedBackDataEntity feedBackData;
}
