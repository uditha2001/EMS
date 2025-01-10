package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
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
    public List<Moderation> getAllCourses() {
        return service.getAllCourses();
    }

    @GetMapping("/{id}")
    public Moderation getCourseById(@PathVariable Long id) {
        return service.getCourseById(id).orElse(null);
    }

    @PostMapping
    public CoursesEntity createCourse(@RequestBody CoursesEntity course) {
        return service.createCourse(course);
    }

    @PutMapping("/{id}")
    public CoursesEntity updateCourse(@PathVariable Long id, @RequestBody CoursesEntity course) {
        return service.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable Long id) {
        service.deleteCourse(id);
    }
}
