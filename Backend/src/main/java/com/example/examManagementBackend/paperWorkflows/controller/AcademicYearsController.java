package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.AcademicYearDTO;
import com.example.examManagementBackend.paperWorkflows.service.AcademicYearsService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/academic-years")
public class AcademicYearsController {

    @Autowired
    private AcademicYearsService academicYearsService;

    @GetMapping
    public ResponseEntity<StandardResponse> getAllAcademicYears() {
        List<AcademicYearDTO> academicYears = academicYearsService.getAllAcademicYears();
        return new ResponseEntity<>(
                new StandardResponse(200, "Successfully retrieved all academic years", academicYears),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getAcademicYearById(@PathVariable Long id) {
        return academicYearsService.getAcademicYearById(id)
                .map(academicYear -> new ResponseEntity<>(
                        new StandardResponse(200, "Successfully retrieved academic year", academicYear),
                        HttpStatus.OK
                ))
                .orElseGet(() -> new ResponseEntity<>(
                        new StandardResponse(404, "Academic year not found with ID: " + id, null),
                        HttpStatus.NOT_FOUND
                ));
    }

    @PostMapping
    public ResponseEntity<StandardResponse> createAcademicYear(@RequestBody AcademicYearDTO academicYearDTO) {
        AcademicYearDTO createdAcademicYear = academicYearsService.createAcademicYear(academicYearDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Academic year created successfully", createdAcademicYear),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateAcademicYear(@PathVariable Long id, @RequestBody AcademicYearDTO academicYearDTO) {
        if (academicYearsService.getAcademicYearById(id).isEmpty()) {
            return new ResponseEntity<>(
                    new StandardResponse(404, "Academic year not found with ID: " + id, null),
                    HttpStatus.NOT_FOUND
            );
        }
        AcademicYearDTO updatedAcademicYear = academicYearsService.updateAcademicYear(id, academicYearDTO);
        return new ResponseEntity<>(
                new StandardResponse(200, "Academic year updated successfully", updatedAcademicYear),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteAcademicYear(@PathVariable Long id) {
        if (academicYearsService.getAcademicYearById(id).isEmpty()) {
            return new ResponseEntity<>(
                    new StandardResponse(404, "Academic year not found with ID: " + id, null),
                    HttpStatus.NOT_FOUND
            );
        }
        academicYearsService.deleteAcademicYear(id);
        return new ResponseEntity<>(
                new StandardResponse(204, "Academic year deleted successfully", null),
                HttpStatus.NO_CONTENT
        );
    }
}
