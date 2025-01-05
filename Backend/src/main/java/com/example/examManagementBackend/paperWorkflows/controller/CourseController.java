package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.entity.CourseEntity;
import com.example.examManagementBackend.paperWorkflows.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService service;

    @GetMapping
    public List<CourseEntity> getAllCourses() {
        return service.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseEntity getCourseById(@PathVariable Long id) {
        return service.getCourseById(id).orElse(null);
    }

    @PostMapping
    public CourseEntity createCourse(@RequestBody CourseEntity course) {
        return service.createCourse(course);
    }

    @PutMapping("/{id}")
    public CourseEntity updateCourse(@PathVariable Long id, @RequestBody CourseEntity course) {
        return service.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        service.deleteCourse(id);
    }
}
