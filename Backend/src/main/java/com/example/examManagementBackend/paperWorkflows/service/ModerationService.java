package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionUpdateDto;
import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
import com.example.examManagementBackend.paperWorkflows.entity.Question;
import com.example.examManagementBackend.paperWorkflows.repository.ModerationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.QuestionRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModerationService {
    @Autowired
    private ModerationRepository moderationRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserManagementRepo userRepository;

    @Autowired
    private PdfQuestionExtractor pdfQuestionExtractor;

    @Autowired
    private AuditLogService auditLogService;

    public Moderation createModeration(Long examPaperId, Long moderatorId, String filePath) throws Exception {
        List<String> questions = pdfQuestionExtractor.extractQuestions(filePath);

        Moderation moderation = new Moderation();
        moderation.setExamPaperId(examPaperId);
        moderation.setModeratorId(moderatorId);
        moderation = moderationRepository.save(moderation);

        int questionNumber = 1;
        for (String question : questions) {
            Question q = new Question();
            q.setModeration(moderation);
            q.setQuestionNumber(questionNumber++);
            q.setOriginalText(question);
            questionRepository.save(q);
        }

        return moderation;
    }

    public List<Question> getQuestions(Long moderationId) {
        return questionRepository.findByModerationId(moderationId);
    }

    public void updateQuestion(Long moderationId, Long questionId, QuestionUpdateDto dto, Long moderatorId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        UserEntity moderator = userRepository.findById(moderatorId)
                .orElseThrow(() -> new RuntimeException("Moderator not found"));

        if (dto.getUpdatedText() != null) {
            auditLogService.logChange(question, moderator, "UpdatedText", question.getUpdatedText(), dto.getUpdatedText());
            question.setUpdatedText(dto.getUpdatedText());
        }

        if (dto.getFeedback() != null) {
            auditLogService.logChange(question, moderator, "Feedback", question.getFeedback(), dto.getFeedback());
            question.setFeedback(dto.getFeedback());
        }

        if (dto.getStatus() != null) {
            auditLogService.logChange(question, moderator, "Status", question.getStatus(), dto.getStatus());
            question.setStatus(dto.getStatus());
        }

        question.setModerator(moderator);
        questionRepository.save(question);
    }
}

