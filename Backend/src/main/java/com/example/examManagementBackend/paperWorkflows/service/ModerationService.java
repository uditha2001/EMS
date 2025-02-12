package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.dto.SubQuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.dto.SubSubQuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.entity.QuestionStructureEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubSubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.repository.QuestionStructureRepository;
import com.example.examManagementBackend.paperWorkflows.repository.SubQuestionRepository;
import com.example.examManagementBackend.paperWorkflows.repository.SubSubQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ModerationService {

    private final QuestionStructureRepository questionRepository;
    private final SubQuestionRepository subQuestionRepository;
    private final SubSubQuestionRepository subSubQuestionRepository;

    public ModerationService(QuestionStructureRepository questionRepository, SubQuestionRepository subQuestionRepository, SubSubQuestionRepository subSubQuestionRepository) {
        this.questionRepository = questionRepository;
        this.subQuestionRepository = subQuestionRepository;
        this.subSubQuestionRepository = subSubQuestionRepository;

    }
    public void moderateQuestionWithHierarchy(QuestionModerationDTO dto) {
        // Moderate the main question
        if (questionRepository.existsById(dto.getQuestionId())) {
            QuestionStructureEntity question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Main question not found"));
            question.setModeratorComment(dto.getComment());
            question.setStatus(dto.getStatus());
            questionRepository.save(question);

            // Moderate sub-questions
            for (SubQuestionModerationDTO subQuestionDTO : dto.getSubQuestions()) {
                SubQuestionEntity subQuestion = subQuestionRepository.findById(subQuestionDTO.getSubQuestionId())
                        .orElseThrow(() -> new RuntimeException("Sub-question not found"));
                subQuestion.setModeratorComment(subQuestionDTO.getComment());
                subQuestion.setStatus(subQuestionDTO.getStatus());
                subQuestionRepository.save(subQuestion);

                // Moderate sub-sub-questions
                for (SubSubQuestionModerationDTO subSubQuestionDTO : subQuestionDTO.getSubSubQuestions()) {
                    SubSubQuestionEntity subSubQuestion = subSubQuestionRepository.findById(subSubQuestionDTO.getSubSubQuestionId())
                            .orElseThrow(() -> new RuntimeException("Sub-sub-question not found"));
                    subSubQuestion.setModeratorComment(subSubQuestionDTO.getComment());
                    subSubQuestion.setStatus(subSubQuestionDTO.getStatus());
                    subSubQuestionRepository.save(subSubQuestion);
                }
            }
        } else {
            throw new RuntimeException("Main question not found for moderation");
        }
    }
}
