package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramCourseDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
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
    public List<CoursesEntity> getAllCourses(){
        return service.getAllCourses();
    }

    @PostMapping
    public CoursesEntity saveCourse(@Valid @RequestBody DegreeProgramCourseDTO dto){
        return service.createCourse(dto);
    }

    @GetMapping("/degree/{id}/courses")
    public List<CoursesEntity> getDegreeProgramRelatedCourses(@PathVariable int degreeProgramId){
        return service.getAllCoursesForDegreeProgram(degreeProgramId);
    }


    @GetMapping("/{id}")
    public CoursesEntity getCourse(@PathVariable int id){
        return service.getCourseById(id);
    }


    @PutMapping("/{id}")
    public CoursesEntity updateCourse(@Valid @RequestBody DegreeProgramCourseDTO dto, @PathVariable int id){
        return service.updateCourse(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable int id){
        service.deleteCourse(id);
        return ResponseEntity.ok("Deleted successfully with courseId: " + id);
    }



}
