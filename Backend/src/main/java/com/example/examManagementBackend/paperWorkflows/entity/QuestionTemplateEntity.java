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
@Table(name = "question_templates")
public class QuestionTemplateEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String templateName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "template", orphanRemoval = true)
    private List<QuestionStructureEntity> questionStructures;
}
