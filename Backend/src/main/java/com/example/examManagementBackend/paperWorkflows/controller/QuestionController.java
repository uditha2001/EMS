package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.QuestionStructureDTO;
import com.example.examManagementBackend.paperWorkflows.dto.QuestionTemplateDTO;
import com.example.examManagementBackend.paperWorkflows.dto.TemplateAndStructureDTO;
import com.example.examManagementBackend.paperWorkflows.service.QuestionService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/structure")
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

    @GetMapping("/{paperId}")
    public ResponseEntity<StandardResponse> getQuestionStructure(@PathVariable Long paperId) {
        List<QuestionStructureDTO> questionStructure = questionService.getQuestionStructure(paperId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question structure retrieved successfully.",
                questionStructure
        ));
    }

    @PutMapping("/{paperId}")
    public ResponseEntity<StandardResponse> updateQuestionStructure(
            @PathVariable Long paperId,
            @RequestBody List<QuestionStructureDTO> updatedQuestionStructures) {
        questionService.updateQuestionStructure(paperId, updatedQuestionStructures);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question structure updated successfully.",
                null // No additional data to return
        ));
    }

    @DeleteMapping("/{paperId}")
    public ResponseEntity<StandardResponse> deleteQuestionStructure(@PathVariable Long paperId) {
        questionService.deleteQuestionStructure(paperId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Question structure deleted successfully.",
                null
        ));
    }

    @DeleteMapping("/subQuestion/{subQuestionId}")
    public ResponseEntity<StandardResponse> deleteSubQuestion(@PathVariable Long subQuestionId) {
        questionService.deleteSubQuestion(subQuestionId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Sub-question deleted successfully.",
                null
        ));
    }

    @DeleteMapping("/subSubQuestion/{subSubQuestionId}")
    public ResponseEntity<StandardResponse> deleteSubSubQuestion(@PathVariable Long subSubQuestionId) {
        questionService.deleteSubSubQuestion(subSubQuestionId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Sub-sub-question deleted successfully.",
                null
        ));
    }

    @PostMapping("/save-template-and-structure")
    public ResponseEntity<StandardResponse> saveTemplateAndStructure(
            @RequestBody TemplateAndStructureDTO templateData) {
        questionService.saveTemplateAndStructure(templateData.getTemplate(), templateData.getQuestionStructures());
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Template and question structure saved successfully.",
                null
        ));
    }

    // GET all templates
    @GetMapping("/templates")
    public ResponseEntity<StandardResponse> getAllTemplates() {
        List<QuestionTemplateDTO> templates = questionService.getAllTemplates();
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Templates retrieved successfully.",
                templates
        ));
    }

    // GET a specific template by ID
    @GetMapping("/templates/{templateId}")
    public ResponseEntity<StandardResponse> getTemplateById(@PathVariable Long templateId) {
        QuestionTemplateDTO template = questionService.getTemplateById(templateId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Template retrieved successfully.",
                template
        ));
    }

    @GetMapping("/templates/{templateId}/with-questions")
    public ResponseEntity<StandardResponse> getTemplateWithQuestionStructure(@PathVariable Long templateId) {
        TemplateAndStructureDTO templateWithQuestions = questionService.getTemplateWithQuestionStructure(templateId);
        return ResponseEntity.ok(new StandardResponse(
                200,
                "Template and question structure retrieved successfully.",
                templateWithQuestions
        ));
    }

    @GetMapping("/templates/with-questions")
    public ResponseEntity<StandardResponse> getAllTemplatesWithQuestionStructure() {
        List<TemplateAndStructureDTO> templatesWithQuestions = questionService.getAllTemplatesWithQuestionStructure();
        return ResponseEntity.ok(new StandardResponse(
                200,
                "All templates and question structures retrieved successfully.",
                templatesWithQuestions
        ));
    }


    @DeleteMapping("/delete-template/{templateId}")
    public ResponseEntity<StandardResponse> deleteTemplateAndStructure(@PathVariable Long templateId) {
        try {
            questionService.deleteTemplateAndStructure(templateId);
            // Return a response with success status
            return ResponseEntity.ok(new StandardResponse(
                    200,
                    "Template and associated structures deleted successfully.",
                    null // No data to return
            ));
        } catch (RuntimeException e) {
            // Handle error and return a structured response with the error message
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StandardResponse(
                    404,
                    e.getMessage(),
                    null // No data to return in case of error
            ));
        }
    }



}
