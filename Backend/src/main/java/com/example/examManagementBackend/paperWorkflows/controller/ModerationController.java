package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.FeedBackDTO;
import com.example.examManagementBackend.paperWorkflows.dto.QuestionModerationDTO;
import com.example.examManagementBackend.paperWorkflows.service.ModerationService;
import com.example.examManagementBackend.paperWorkflows.service.PdfGenrationService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/moderation")
public class ModerationController {


    private final ModerationService moderationService;
    private final PdfGenrationService pdfGenrationService;
    public ModerationController(PdfGenrationService pdfGenrationService, ModerationService moderationService) {
        this.pdfGenrationService = pdfGenrationService;
        this.moderationService = moderationService;
    }

    @PostMapping("/question-with-hierarchy")
    public ResponseEntity<StandardResponse> moderateQuestionWithHierarchy(@RequestBody QuestionModerationDTO dto) {
        moderationService.moderateQuestionWithHierarchy(dto);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question and its hierarchy moderated successfully.",
                null
        ));

    }
    //generate the pdf and save data;
    @PostMapping("/saveFeedBackData")
    public ResponseEntity<StandardResponse> saveFeedBackData(@RequestBody FeedBackDTO dto) {
       try{
          return pdfGenrationService.genratePdf(dto);
       }
       catch(Exception e){
           return new ResponseEntity<StandardResponse> (
                   new StandardResponse(500,"failed to create pdf",null), HttpStatus.INTERNAL_SERVER_ERROR
           );
       }

    }
}

