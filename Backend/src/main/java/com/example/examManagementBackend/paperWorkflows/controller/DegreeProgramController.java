//package com.example.examManagementBackend.paperWorkflows.controller;
//
//
//import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/degreeProgram")
//public class DegreeProgramController {
//
//    @Autowired
//    DegreeProgramService degreeProgramService;
//
//    @GetMapping
//    public List<DegreeProgramsEntity> getAllDegreePrograms(){
//        return degreeProgramService.getAllDegreePrograms();
//    }
//
//    @PostMapping
//    public ResponseEntity<DegreeProgramsEntity> saveDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto){
//        DegreeProgramsEntity entity =  degreeProgramService.saveDegreeProgram(dto);
//        return ResponseEntity.ok(entity);
//    }
//
//    @GetMapping("/{id}")
//    public DegreeProgramsEntity getOneDegreeProgram(@PathVariable("id") int id){
//        return degreeProgramService.getOneDegreeProgram(id);
//    }
//
//    @PutMapping("/{id}")
//    public DegreeProgramsEntity updateDegreeProgram(@Valid @RequestBody DegreeProgramDTO dto, @PathVariable("id") int id){
//        return degreeProgramService.updateDegreeProgram(dto, id);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteDegreeProgram(@PathVariable int id){
//        degreeProgramService.deleteDegreeProgram(id);
//        return ResponseEntity.ok("Deleted sucessfully with degreeProgramId: " + id);
//    }
//
//}
