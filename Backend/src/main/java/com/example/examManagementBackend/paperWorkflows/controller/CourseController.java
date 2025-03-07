package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.service.CourseService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService coursesService;

    public CourseController(CourseService coursesService) {
        this.coursesService = coursesService;
    }

    @GetMapping
    public ResponseEntity<StandardResponse> getAllCourses() {
        List<CourseDTO> courses = coursesService.getAllCourses();
        return new ResponseEntity<>(
                new StandardResponse(200, "Successfully retrieved all courses", courses),
                HttpStatus.OK
        );
    }

    @PostMapping
    public ResponseEntity<StandardResponse> saveCourse(@Valid @RequestBody CourseDTO dto) {
        CoursesEntity savedCourse = coursesService.saveCourse(dto);
        return new ResponseEntity<>(
                new StandardResponse(200, "Course created successfully", savedCourse),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getCourseById(@PathVariable Long id) {
        CourseDTO course = coursesService.getCourseById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Successfully retrieved course", course),
                HttpStatus.OK
        );
    }
    //get course details using degree program id
    @GetMapping("/byDegreeProgram")
    public ResponseEntity<StandardResponse> getCourseByDegreeProgram(@RequestParam String degreeName) {
        return  coursesService.getCourseByDegreeProgram(degreeName);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDTO dto) {
        CoursesEntity updatedCourse = coursesService.updateCourse(id, dto);
        return new ResponseEntity<>(
                new StandardResponse(200, "Course updated successfully", updatedCourse),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteCourse(@PathVariable Long id) {
        coursesService.deleteCourse(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Course deleted successfully with ID: " + id, null),
                HttpStatus.OK
        );
    }

    /**
     * Delete a course evaluation by ID.
     */
    @DeleteMapping("/course-evaluations/{courseEvaluationId}")
    public ResponseEntity<StandardResponse> deleteCourseEvaluation(@PathVariable Long courseEvaluationId) {
        try {
            // Call the service method to delete the course evaluation
            coursesService.deleteCourseEvaluation(courseEvaluationId);
            return new ResponseEntity<>(
                    new StandardResponse(200, "Course Evaluation deleted successfully", null),
                    HttpStatus.OK
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    new StandardResponse(404, e.getMessage(), null),
                    HttpStatus.NOT_FOUND
            );
        }
    }
}
