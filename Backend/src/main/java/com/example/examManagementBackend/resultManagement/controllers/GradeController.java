package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.services.GradingService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/changedMarksPercentages")
    public ResponseEntity<StandardResponse> saveChangeMarksPercentages(@RequestBody List<MarksPercentageDTO> marksPercentageDTO){
        return  null;
    }


}
