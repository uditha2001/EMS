package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionStructureDTO;
import com.example.examManagementBackend.paperWorkflows.dto.SubQuestionDTO;
import com.example.examManagementBackend.paperWorkflows.dto.SubSubQuestionDTO;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.QuestionStructureEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.entity.SubSubQuestionEntity;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.QuestionStructureRepository;
import com.example.examManagementBackend.paperWorkflows.repository.SubQuestionRepository;
import com.example.examManagementBackend.paperWorkflows.repository.SubSubQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    @Autowired
    private QuestionStructureRepository questionStructureRepository;

    @Autowired
    private SubQuestionRepository subQuestionRepository;

    @Autowired
    private SubSubQuestionRepository subSubQuestionRepository;

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

    public List<QuestionStructureDTO> getQuestionStructure(Long paperId) {
        List<QuestionStructureEntity> questionEntities = questionStructureRepository.findByEncryptedPaperId(paperId);

        if (questionEntities.isEmpty()) {
            // Log a warning and handle gracefully
            System.out.println("No question structure found for paper ID: " + paperId);

        }

        return questionEntities.stream().map(entity -> {
            QuestionStructureDTO dto = new QuestionStructureDTO();
            dto.setQuestionId(entity.getId());
            dto.setQuestionNumber(entity.getQuestionNumber());
            dto.setQuestionType(entity.getQuestionType());
            dto.setTotalMarks(entity.getTotalMarks());
            dto.setModeratorComment(entity.getModeratorComment());
            dto.setStatus(entity.getStatus());

            List<SubQuestionDTO> subQuestions = entity.getSubQuestions().stream().map(subEntity -> {
                SubQuestionDTO subDto = new SubQuestionDTO();
                subDto.setSubQuestionId(subEntity.getId());
                subDto.setSubQuestionNumber(subEntity.getSubQuestionNumber());
                subDto.setQuestionType(subEntity.getQuestionType());
                subDto.setMarks(subEntity.getMarks());
                subDto.setModeratorComment(entity.getModeratorComment());
                subDto.setStatus(entity.getStatus());

                List<SubSubQuestionDTO> subSubQuestions = subEntity.getSubSubQuestions().stream().map(subSubEntity -> {
                    SubSubQuestionDTO subSubDto = new SubSubQuestionDTO();
                    subSubDto.setSubSubQuestionId(subSubEntity.getId());
                    subSubDto.setSubSubQuestionNumber(subSubEntity.getSubSubQuestionNumber());
                    subSubDto.setQuestionType(subSubEntity.getQuestionType());
                    subSubDto.setMarks(subSubEntity.getMarks());
                    subSubDto.setModeratorComment(entity.getModeratorComment());
                    subSubDto.setStatus(entity.getStatus());
                    return subSubDto;
                }).collect(Collectors.toList());

                subDto.setSubSubQuestions(subSubQuestions);
                return subDto;
            }).collect(Collectors.toList());

            dto.setSubQuestions(subQuestions);
            return dto;
        }).collect(Collectors.toList());
    }

    public void updateQuestionStructure(Long paperId, List<QuestionStructureDTO> updatedQuestionStructures) {
        EncryptedPaper paper = encryptedPaperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        // Fetch existing question structures for the paper
        List<QuestionStructureEntity> existingQuestions = questionStructureRepository.findByEncryptedPaperId(paperId);

        // Update existing question structures or add new ones
        for (QuestionStructureDTO dto : updatedQuestionStructures) {
            Optional<QuestionStructureEntity> existingQuestionOpt = existingQuestions.stream()
                    .filter(q -> q.getId().equals(dto.getQuestionId()))
                    .findFirst();

            QuestionStructureEntity questionEntity = existingQuestionOpt.orElse(new QuestionStructureEntity());
            questionEntity.setEncryptedPaper(paper);
            questionEntity.setQuestionNumber(dto.getQuestionNumber());
            questionEntity.setQuestionType(dto.getQuestionType());
            questionEntity.setTotalMarks(dto.getTotalMarks());
            questionEntity.setModeratorComment(dto.getModeratorComment());
            questionEntity.setStatus(dto.getStatus());

            List<SubQuestionEntity> subQuestions = dto.getSubQuestions().stream().map(subDto -> {
                SubQuestionEntity subQuestion = questionEntity.getSubQuestions().stream()
                        .filter(sq -> sq.getId().equals(subDto.getSubQuestionId()))
                        .findFirst()
                        .orElse(new SubQuestionEntity());
                subQuestion.setQuestionStructure(questionEntity);
                subQuestion.setSubQuestionNumber(subDto.getSubQuestionNumber());
                subQuestion.setQuestionType(subDto.getQuestionType());
                subQuestion.setMarks(subDto.getMarks());

                List<SubSubQuestionEntity> subSubQuestions = subDto.getSubSubQuestions().stream().map(subSubDto -> {
                    SubSubQuestionEntity subSubQuestion = subQuestion.getSubSubQuestions().stream()
                            .filter(ssq -> ssq.getId().equals(subSubDto.getSubSubQuestionId()))
                            .findFirst()
                            .orElse(new SubSubQuestionEntity());
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

            // Save or update the entity
            questionStructureRepository.save(questionEntity);
        }
    }

    public void deleteQuestionStructure(Long paperId) {
        List<QuestionStructureEntity> questionEntities = questionStructureRepository.findByEncryptedPaperId(paperId);
        if (questionEntities.isEmpty()) {
            throw new RuntimeException("No question structure found for paper ID: " + paperId);
        }
        questionStructureRepository.deleteAll(questionEntities);
    }

    public void deleteSubQuestion(Long subQuestionId) {
        SubQuestionEntity subQuestion = subQuestionRepository.findById(subQuestionId)
                .orElseThrow(() -> new RuntimeException("Sub-question not found with ID: " + subQuestionId));
        subQuestionRepository.delete(subQuestion);
    }

    public void deleteSubSubQuestion(Long subSubQuestionId) {
        SubSubQuestionEntity subSubQuestion = subSubQuestionRepository.findById(subSubQuestionId)
                .orElseThrow(() -> new RuntimeException("Sub-sub-question not found with ID: " + subSubQuestionId));
        subSubQuestionRepository.delete(subSubQuestion);
    }
    

}

