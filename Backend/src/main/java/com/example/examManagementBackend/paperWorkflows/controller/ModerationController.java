package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.service.ModerationService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/moderation")
public class ModerationController {

    @Autowired
    private ModerationService moderationService;

    @PostMapping("/question")
    public ResponseEntity<StandardResponse> moderateQuestion(@RequestBody QuestionModerationDTO dto) {
        moderationService.moderateQuestion(dto);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question moderated successfully.",
                null // No additional data to return
        ));
    }
}
