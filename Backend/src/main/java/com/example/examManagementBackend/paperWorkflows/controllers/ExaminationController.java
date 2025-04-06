package com.example.examManagementBackend.paperWorkflows.controllers;

import com.example.examManagementBackend.paperWorkflows.dto.ExaminationCoursesDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.service.ExaminationService;
import com.example.examManagementBackend.timetable.dto.TimeTableCoursesDTO;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/academic-years")
public class ExaminationController {
    private final ExaminationService examinationService;
    public ExaminationController(ExaminationService examinationService) {
        this.examinationService = examinationService;
    }

    @PostMapping
    public ResponseEntity<StandardResponse> createExamination(@RequestBody ExaminationDTO ExaminationsDTO) {
        ExaminationDTO createdExamination = examinationService.createExamination(ExaminationsDTO);
        return new ResponseEntity<>(
                new StandardResponse(201, "Examination created successfully", createdExamination),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getExaminationById(@PathVariable Long id) {
        ExaminationDTO Examination = examinationService.getExaminationById(id);
        return new ResponseEntity<>(
                new StandardResponse(200, "Examination retrieved successfully", Examination),
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<StandardResponse> getAllExaminations() {
        List<ExaminationDTO> Examinations = examinationService.getAllExaminations();
        return new ResponseEntity<>(
                new StandardResponse(200, "Examinations retrieved successfully", Examinations),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> updateExamination(@PathVariable Long id, @RequestBody ExaminationDTO ExaminationsDTO) {
        ExaminationDTO updatedExamination = examinationService.updateExamination(id, ExaminationsDTO);
        return new ResponseEntity<>(
                new StandardResponse(200, "Examination updated successfully", updatedExamination),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteExamination(@PathVariable Long id) {
        examinationService.deleteExamination(id);
        return new ResponseEntity<>(
                new StandardResponse(204, "Examination deleted successfully", null),
                HttpStatus.NO_CONTENT
        );
    }

    @GetMapping("/examinations/{examinationId}/courses")
    public ResponseEntity<ExaminationCoursesDTO> getExaminationDataById(@PathVariable Long examinationId) {
        ExaminationCoursesDTO response = examinationService.getExaminationWithCoursesById(examinationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/examinations/{examinationId}/allCourses")
    public ResponseEntity<ExaminationCoursesDTO> getExaminationCoursesById(@PathVariable Long examinationId) {
        ExaminationCoursesDTO response = examinationService.getExaminationWithAllActiveCoursesById(examinationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getCoursesUsingExaminationId")
    public ResponseEntity<StandardResponse> getCoursesUsingExaminationId(@RequestParam Long examinationId) {
        return examinationService.getCoursesByExaminationId(examinationId);
    }
    @PutMapping("/{examId}/update-status")
    public ResponseEntity<String> updateExamStatus(@PathVariable Long examId) {
        examinationService.updateExamStatus(examId);
        return ResponseEntity.ok("Exam status updated successfully!");
    }


    @GetMapping("/{examinationId}/courses")
    public ResponseEntity<List<TimeTableCoursesDTO>> getCoursesByExamination(@PathVariable Long examinationId) {
        try {
            List<TimeTableCoursesDTO> courseDTOs = examinationService.getCoursesByExamination(examinationId);
            return ResponseEntity.ok(courseDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build(); // If the examination ID is not found
        }
    }

    @GetMapping("/with-timetable")
    public ResponseEntity<StandardResponse> getExaminationsWithTimetable() {
        List<ExaminationDTO> examinations = examinationService.getExaminationsWithTimetable();

        if (examinations.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new StandardResponse(404, "No examinations with timetables found", null));
        }

        return ResponseEntity.ok(new StandardResponse(200, "Examinations with timetables retrieved successfully", examinations));
    }

    @GetMapping("/ongoing/count")
    public ResponseEntity<Long> getOngoingExaminationsCount() {
        Long count = examinationService.getOngoingExaminationsCount();
        return ResponseEntity.ok(count);
    }

}
