package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionStructureDTO;
import com.example.examManagementBackend.paperWorkflows.service.QuestionService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/{paperId}")
    public ResponseEntity<StandardResponse> addQuestionStructure(
            @PathVariable Long paperId,
            @RequestBody List<QuestionStructureDTO> questionStructureDTOs) {
        questionService.saveQuestionStructure(paperId, questionStructureDTOs);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question structure added successfully.",
                null // No additional data to return
        ));
    }
}
