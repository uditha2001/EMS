package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.paperWorkflows.service.CourseService;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.resultManagement.services.GradingService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/grading")
public class GradeController {
    private final GradingService gradingService;
    public GradeController(GradingService gradingService) {
        this.gradingService = gradingService;
    }

    @GetMapping("/marksPercentage")
    public ResponseEntity<StandardResponse> getPassMarksPercentage(@RequestParam String courseCode) {
        return gradingService.getRequiredPercentagesAndPassMark(courseCode);
    }

}
