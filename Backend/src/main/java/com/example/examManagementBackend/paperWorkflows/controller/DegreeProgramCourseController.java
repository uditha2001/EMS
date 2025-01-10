package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramCourseDTO;
import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramCourseEntity;
import com.example.examManagementBackend.paperWorkflows.service.DegreeProgramCourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/degreeProgramCourse")
public class DegreeProgramCourseController {

    @Autowired
    DegreeProgramCourseService service;

    @GetMapping
    public List<DegreeProgramCourseEntity> getAllCourses(){
        return service.getAllCourses();
    }

    @PostMapping
    public DegreeProgramCourseEntity saveCourse(@Valid @RequestBody DegreeProgramCourseDTO dto){
        return service.createCourse(dto);
    }

    @GetMapping("/degree/{id}/courses")
    public List<DegreeProgramCourseEntity> getDegreeProgramRelatedCourses(@PathVariable int degreeProgramId){
        return service.getAllCoursesForDegreeProgram(degreeProgramId);
    }


    @GetMapping("/{id}")
    public DegreeProgramCourseEntity getCourse(@PathVariable int id){
        return service.getCourseById(id);
    }


    @PutMapping("/{id}")
    public DegreeProgramCourseEntity updateCourse(@Valid @RequestBody DegreeProgramCourseDTO dto, @PathVariable int id){
        return service.updateCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable int id){
        service.deleteCourse(id);
        return ResponseEntity.ok("Deleted successfully with courseId: " + id);
    }



}
