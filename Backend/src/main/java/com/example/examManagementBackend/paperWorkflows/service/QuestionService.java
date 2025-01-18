package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionStructureDTO;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.QuestionStructureEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubSubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.QuestionStructureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    @Autowired
    private QuestionStructureRepository questionStructureRepository;

    public void saveQuestionStructure(Long paperId, List<QuestionStructureDTO> questionStructureDTOs) {
        EncryptedPaper paper = encryptedPaperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        List<QuestionStructureEntity> questionEntities = questionStructureDTOs.stream().map(dto -> {
            QuestionStructureEntity questionEntity = new QuestionStructureEntity();
            questionEntity.setEncryptedPaper(paper);
            questionEntity.setQuestionNumber(dto.getQuestionNumber());
            questionEntity.setQuestionType(dto.getQuestionType());
            questionEntity.setTotalMarks(dto.getTotalMarks());

            List<SubQuestionEntity> subQuestions = dto.getSubQuestions().stream().map(subDto -> {
                SubQuestionEntity subQuestion = new SubQuestionEntity();
                subQuestion.setQuestionStructure(questionEntity);
                subQuestion.setSubQuestionNumber(subDto.getSubQuestionNumber());
                subQuestion.setQuestionType(subDto.getQuestionType());
                subQuestion.setMarks(subDto.getMarks());

                List<SubSubQuestionEntity> subSubQuestions = subDto.getSubSubQuestions().stream().map(subSubDto -> {
                    SubSubQuestionEntity subSubQuestion = new SubSubQuestionEntity();
                    subSubQuestion.setSubQuestion(subQuestion);
                    subSubQuestion.setSubSubQuestionNumber(subSubDto.getSubSubQuestionNumber());
                    subSubQuestion.setQuestionType(subSubDto.getQuestionType());
                    subSubQuestion.setMarks(subSubDto.getMarks());
                    return subSubQuestion;
                }).collect(Collectors.toList());

                subQuestion.setSubSubQuestions(subSubQuestions);
                return subQuestion;
            }).collect(Collectors.toList());

            questionEntity.setSubQuestions(subQuestions);
            return questionEntity;
        }).collect(Collectors.toList());

        questionStructureRepository.saveAll(questionEntities);
    }
}

