package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.ModerationRequestDto;
import com.example.examManagementBackend.paperWorkflows.dto.ModerationResponseDto;
import com.example.examManagementBackend.paperWorkflows.dto.QuestionDto;
import com.example.examManagementBackend.paperWorkflows.dto.QuestionUpdateDto;
import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
import com.example.examManagementBackend.paperWorkflows.entity.Question;
import com.example.examManagementBackend.paperWorkflows.service.ModerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/moderations")
public class ModerationController {
    @Autowired
    private ModerationService moderationService;

    @PostMapping("/upload")
    public ResponseEntity<ModerationResponseDto> uploadPdf(
            @RequestPart("details") ModerationRequestDto moderationRequestDto,
            @RequestPart("file") MultipartFile file) {
        try {
            Path tempFile = Files.createTempFile("exam-paper", ".pdf");
            file.transferTo(tempFile.toFile());
            Moderation moderation = moderationService.createModeration(
                    moderationRequestDto.getExamPaperId(),
                    moderationRequestDto.getModeratorId(),
                    tempFile.toString()
            );
            Files.delete(tempFile);

            ModerationResponseDto response = new ModerationResponseDto();
            response.setId(moderation.getId());
            response.setExamPaperId(moderation.getExamPaperId());
            response.setModeratorId(moderation.getModeratorId());
            response.setStatus(moderation.getStatus());
            response.setCreatedAt(moderation.getCreatedAt());
            response.setUpdatedAt(moderation.getUpdatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{moderationId}/questions")
    public ResponseEntity<List<QuestionDto>> getQuestions(@PathVariable Long moderationId) {
        List<Question> questions = moderationService.getQuestions(moderationId);
        List<QuestionDto> questionDtos = questions.stream().map(question -> {
            QuestionDto dto = new QuestionDto();
            dto.setId(question.getId());
            dto.setQuestionNumber(question.getQuestionNumber());
            dto.setOriginalText(question.getOriginalText());
            dto.setUpdatedText(question.getUpdatedText());
            dto.setFeedback(question.getFeedback());
            dto.setStatus(question.getStatus());
            dto.setModeratorId(question.getModerator().getUserId());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(questionDtos);
    }

    @PatchMapping("/{moderationId}/questions/{questionId}")
    public ResponseEntity<?> updateQuestion(
            @PathVariable Long moderationId,
            @PathVariable Long questionId,
            @RequestBody QuestionUpdateDto questionUpdateDto,
            @RequestParam("moderatorId") Long moderatorId) {
        try {
            moderationService.updateQuestion(moderationId, questionId, questionUpdateDto, moderatorId);
            return ResponseEntity.ok("Question updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating question: " + e.getMessage());
        }
    }
}

