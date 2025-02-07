package com.example.examManagementBackend.paperWorkflows.entity.moderatorFeedbacks;

import com.example.examManagementBackend.paperWorkflows.entity.ExamPaperEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Table(name = "feedBackData")
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
    private String examination;
    @Column(columnDefinition = "TEXT")
    private String agreeAndAddressed;
    @Column(columnDefinition = "TEXT")
    private String notAgreeAndReasons;
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name="exam_paper_id",referencedColumnName = "id")
    private ExamPaperEntity examPaperEntity;
    @OneToMany(mappedBy = "feedBackData",cascade = CascadeType.ALL)
    private List<QuestionFeedBackEntity> questionFeedBackEntityList;

}
