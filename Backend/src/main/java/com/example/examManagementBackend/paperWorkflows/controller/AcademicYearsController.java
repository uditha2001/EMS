package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.AcademicYearDTO;
import com.example.examManagementBackend.paperWorkflows.service.AcademicYearsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/academic-years")
public class AcademicYearsController {
    @Autowired
    private AcademicYearsService academicYearsService;

    @GetMapping
    public List<AcademicYearDTO> getAllAcademicYears() {
        return academicYearsService.getAllAcademicYears();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> getAcademicYearById(@PathVariable Long id) {
        Optional<AcademicYearDTO> academicYear = academicYearsService.getAcademicYearById(id);
        return academicYear.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AcademicYearDTO createAcademicYear(@RequestBody AcademicYearDTO academicYearDTO) {
        return academicYearsService.createAcademicYear(academicYearDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicYearDTO> updateAcademicYear(@PathVariable Long id, @RequestBody AcademicYearDTO academicYearDTO) {
        Optional<AcademicYearDTO> existing = academicYearsService.getAcademicYearById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        AcademicYearDTO updated = academicYearsService.updateAcademicYear(id, academicYearDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcademicYear(@PathVariable Long id) {
        Optional<AcademicYearDTO> existing = academicYearsService.getAcademicYearById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        academicYearsService.deleteAcademicYear(id);
        return ResponseEntity.noContent().build();
    }
}
