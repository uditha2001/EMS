package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.AcademicYearDTO;
import com.example.examManagementBackend.paperWorkflows.service.AcademicYearService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-years")
public class AcademicYearController {

    @Autowired
    private AcademicYearService academicYearsService;

    @PostMapping
    public ResponseEntity<StandardResponse> createAcademicYear(@RequestBody AcademicYearDTO academicYearsDTO) {
        AcademicYearDTO createdAcademicYear = academicYearsService.createAcademicYear(academicYearsDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Academic year created successfully", createdAcademicYear),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getAcademicYearById(@PathVariable Long id) {
        AcademicYearDTO academicYear = academicYearsService.getAcademicYearById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Academic year retrieved successfully", academicYear),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<StandardResponse> getAllAcademicYears() {
        List<AcademicYearDTO> academicYears = academicYearsService.getAllAcademicYears();
        return new ResponseEntity<>(
                new StandardResponse(200, "Academic years retrieved successfully", academicYears),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateAcademicYear(@PathVariable Long id, @RequestBody AcademicYearDTO academicYearsDTO) {
        AcademicYearDTO updatedAcademicYear = academicYearsService.updateAcademicYear(id, academicYearsDTO);
        return new ResponseEntity<>(
                new StandardResponse(200, "Academic year updated successfully", updatedAcademicYear),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteAcademicYear(@PathVariable Long id) {
        academicYearsService.deleteAcademicYear(id);
        return new ResponseEntity<>(
                new StandardResponse(204, "Academic year deleted successfully", null),
                HttpStatus.NO_CONTENT
        );
    }
}
