package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionModerationDTO;
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

    @Autowired
    private QuestionStructureRepository questionRepository;

    @Autowired
    private SubQuestionRepository subQuestionRepository;

    @Autowired
    private SubSubQuestionRepository subSubQuestionRepository;

    public void moderateQuestion(QuestionModerationDTO dto) {
        // Check if the question exists in main, sub, or sub-sub levels
        if (questionRepository.existsById(dto.getQuestionId())) {
            QuestionStructureEntity question = questionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Main question not found"));
            question.setModeratorComment(dto.getComment());
            question.setStatus(dto.getStatus());
            questionRepository.save(question);
        } else if (subQuestionRepository.existsById(dto.getQuestionId())) {
            SubQuestionEntity subQuestion = subQuestionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Sub-question not found"));
            subQuestion.setModeratorComment(dto.getComment());
            subQuestion.setStatus(dto.getStatus());
            subQuestionRepository.save(subQuestion);
        } else if (subSubQuestionRepository.existsById(dto.getQuestionId())) {
            SubSubQuestionEntity subSubQuestion = subSubQuestionRepository.findById(dto.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Sub-sub-question not found"));
            subSubQuestion.setModeratorComment(dto.getComment());
            subSubQuestion.setStatus(dto.getStatus());
            subSubQuestionRepository.save(subSubQuestion);
        } else {
            throw new RuntimeException("Question not found");
        }
    }
}

