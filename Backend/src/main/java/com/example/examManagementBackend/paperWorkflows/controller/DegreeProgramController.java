package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.service.DegreeProgramService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/degreePrograms")
public class DegreeProgramController {

    @Autowired
    private DegreeProgramService degreeProgramService;

    /**
     * Get all degree programs.
     */
    @GetMapping
    public ResponseEntity<List<DegreeProgramDTO>> getAllDegreePrograms() {
        return ResponseEntity.ok(degreeProgramService.getAllDegreePrograms());
    }

    /**
     * Save a new degree program.
     */
    @PostMapping
    public ResponseEntity<DegreeProgramDTO> saveDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto) {
        return ResponseEntity.status(201).body(degreeProgramService.saveDegreeProgram(dto));
    }

    /**
     * Get a single degree program by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DegreeProgramDTO> getOneDegreeProgram(@PathVariable("id") int id) {
        return ResponseEntity.ok(degreeProgramService.getOneDegreeProgram(id));
    }

    /**
     * Update an existing degree program by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DegreeProgramDTO> updateDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto, @PathVariable("id") int id) {
        return ResponseEntity.ok(degreeProgramService.updateDegreeProgram(dto, id));
    }

    /**
     * Delete a degree program by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDegreeProgram(@PathVariable("id") int id) {
        degreeProgramService.deleteDegreeProgram(id);
        return ResponseEntity.ok("Degree program deleted successfully with ID: " + id);
    }
}
