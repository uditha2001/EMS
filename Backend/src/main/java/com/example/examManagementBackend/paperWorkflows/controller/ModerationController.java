package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.service.ModerationService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/moderation")
public class ModerationController {

    @Autowired
    private ModerationService moderationService;

    @PostMapping("/question-with-hierarchy")
    public ResponseEntity<StandardResponse> moderateQuestionWithHierarchy(@RequestBody QuestionModerationDTO dto) {
        moderationService.moderateQuestionWithHierarchy(dto);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question and its hierarchy moderated successfully.",
                null
        ));
    }
}

