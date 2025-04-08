package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.resultManagement.services.ExamTypesService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/examType")
public class ExamTypesController {
    private final ExamTypesService examTypesService;
    public ExamTypesController(ExamTypesService examTypesService) {
        this.examTypesService = examTypesService;
    }
    @GetMapping("/allExamTypes")
    public ResponseEntity<StandardResponse> getAllExamsTypes(){
        return examTypesService.getAllExamTypes();
    }
    @GetMapping("/examTypesById")
    public ResponseEntity<StandardResponse> getExamTypesById(@RequestParam Long examTypeId){
        return examTypesService.getExamTypeById(examTypeId);
    }
    @PostMapping("/examTypes")
    public ResponseEntity<StandardResponse> createExamType(@RequestParam String examType){
        return examTypesService.addExamType(examType);
    }
    @PutMapping("/examType")
    public ResponseEntity<StandardResponse> updateExamType(@RequestParam Long examTypeId, @RequestParam String examType){
        return examTypesService.updateExamType(examType,examTypeId);
    }

    @DeleteMapping("/deleteExamType")
    public ResponseEntity<StandardResponse> deleteExamType(@RequestParam Long examTypeId){
        return examTypesService.deleteExamTypeById(examTypeId);
    }



}
