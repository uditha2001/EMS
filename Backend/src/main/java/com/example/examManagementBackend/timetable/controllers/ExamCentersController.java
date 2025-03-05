package com.example.examManagementBackend.timetable.controllers;

import com.example.examManagementBackend.timetable.dto.ExamCentersDTO;
import com.example.examManagementBackend.timetable.services.ExamCenterService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exam-centers")
public class ExamCentersController {

    private final ExamCenterService examCenterService;

    public ExamCentersController(ExamCenterService examCenterService) {
        this.examCenterService = examCenterService;
    }

    // Get all exam centers
    @GetMapping
    public ResponseEntity<StandardResponse> getAllExamCenters() {
        List<ExamCentersDTO> examCenters = examCenterService.getAllExamCenters();
        StandardResponse response = StandardResponse.success(examCenters);
        return ResponseEntity.ok(response);
    }

    // Get exam center by id
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getExamCenterById(@PathVariable Long id) {
        return examCenterService.getExamCenterById(id)
                .map(examCentersDTO -> ResponseEntity.ok(StandardResponse.success(examCentersDTO)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(StandardResponse.error(404, "Exam Center not found")));
    }

    // Create a new exam center
    @PostMapping
    public ResponseEntity<StandardResponse> createExamCenter(@RequestBody ExamCentersDTO examCentersDTO) {
        ExamCentersDTO createdExamCenter = examCenterService.createExamCenter(examCentersDTO);
        StandardResponse response = StandardResponse.success(createdExamCenter);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Update an existing exam center
    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateExamCenter(@PathVariable Long id, @RequestBody ExamCentersDTO examCentersDTO) {
        return examCenterService.updateExamCenter(id, examCentersDTO)
                .map(updatedExamCenter -> ResponseEntity.ok(StandardResponse.success(updatedExamCenter)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(StandardResponse.error(404, "Exam Center not found")));
    }

    // Delete an exam center
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteExamCenter(@PathVariable Long id) {
        return examCenterService.deleteExamCenter(id)
                .map(deleted -> ResponseEntity.status(HttpStatus.NO_CONTENT).body(StandardResponse.success("Exam Center deleted successfully")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(StandardResponse.error(404, "Exam Center not found")));
    }


}
