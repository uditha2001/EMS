package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.ExaminationCoursesDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.service.ExaminationService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-years")
public class ExaminationController {


    private ExaminationService examinationService;
    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @PostMapping
    public ResponseEntity<StandardResponse> createExamination(@RequestBody ExaminationDTO ExaminationsDTO) {
        ExaminationDTO createdExamination = examinationService.createExamination(ExaminationsDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Examination created successfully", createdExamination),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getExaminationById(@PathVariable Long id) {
        ExaminationDTO Examination = examinationService.getExaminationById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Examination retrieved successfully", Examination),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<StandardResponse> getAllExaminations() {
        List<ExaminationDTO> Examinations = examinationService.getAllExaminations();
        return new ResponseEntity<>(
                new StandardResponse(200, "Examinations retrieved successfully", Examinations),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateExamination(@PathVariable Long id, @RequestBody ExaminationDTO ExaminationsDTO) {
        ExaminationDTO updatedExamination = examinationService.updateExamination(id, ExaminationsDTO);
        return new ResponseEntity<>(
                new StandardResponse(200, "Examination updated successfully", updatedExamination),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteExamination(@PathVariable Long id) {
        examinationService.deleteExamination(id);
        return new ResponseEntity<>(
                new StandardResponse(204, "Examination deleted successfully", null),
                HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/examinations/{examinationId}/courses")
    public ResponseEntity<ExaminationCoursesDTO> getExaminationDataById(@PathVariable Long examinationId) {
        ExaminationCoursesDTO response = examinationService.getExaminationWithCoursesById(examinationId);
        return ResponseEntity.ok(response);
    }

}
