package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramEntity;
import com.example.examManagementBackend.paperWorkflows.service.DegreeProgramService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/degreeProgram")
public class DegreeProgramController {

    @Autowired
    DegreeProgramService degreeProgramService;

    @GetMapping
    public List<DegreeProgramEntity> getAllDegreePrograms(){
        return degreeProgramService.getAllDegreePrograms();
    }

    @PostMapping
    public ResponseEntity<DegreeProgramEntity> saveDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto){
        DegreeProgramEntity entity =  degreeProgramService.saveDegreeProgram(dto);
        return ResponseEntity.ok(entity);
    }

    @GetMapping("/{id}")
    public DegreeProgramEntity getOneDegreeProgram(@PathVariable("id") int id){
        return degreeProgramService.getOneDegreeProgram(id);
    }

    @PutMapping("/{id}")
    public DegreeProgramEntity updateDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto, @PathVariable("id") int id){
        return degreeProgramService.updateDegreeProgram(dto, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDegreeProgram(@PathVariable int id){
        degreeProgramService.deleteDegreeProgram(id);
        return ResponseEntity.ok("Deleted sucessfully with degreeProgramId: " + id);
    }

}
