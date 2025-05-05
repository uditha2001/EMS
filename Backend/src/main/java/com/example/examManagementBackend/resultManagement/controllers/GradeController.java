package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.services.GradingService;
import com.example.examManagementBackend.resultManagement.services.ResultService;
import com.example.examManagementBackend.utill.StandardResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grading")
public class GradeController {
    private final GradingService gradingService;
    public GradeController(GradingService gradingService, ResultService resultService) {
        this.gradingService = gradingService;
    }

    @GetMapping("/marksPercentage")
    public ResponseEntity<StandardResponse> getPassMarksPercentage(@RequestParam String courseCode) {
        return gradingService.getRequiredPercentagesAndPassMark(courseCode);
    }

    @PostMapping("/changedMarksPercentages")
    public ResponseEntity<StandardResponse> saveChangeMarksPercentages(@RequestBody List<MarksPercentageDTO> conditions){
        return gradingService.saveChangedGradings(conditions);
    }

    @GetMapping("/grades")
    public ResponseEntity<StandardResponse> getGrades(@RequestParam String courseCode, @RequestParam Long ExaminationId) {
        return  gradingService.getGradingsMark(courseCode, ExaminationId);
    }

    @GetMapping("/publishedCourses")
    public ResponseEntity<StandardResponse> getPublishedCourses(@RequestParam Long degreeProgramId) {
        return gradingService.getAllPublishedCoursesResults(degreeProgramId);
    }
    @GetMapping("/resultsReleasedYears")
    public ResponseEntity<StandardResponse> getResultsReleasedYears() {
        return gradingService.getPublishedYears();
    }
    @GetMapping("/allCourseWithAllYears")
    public ResponseEntity<StandardResponse> getAllResults(@RequestParam Long degreeProgramId) {
            return gradingService.getAllExaminationDetails(degreeProgramId);
    }
    @GetMapping("/allResultsWithCourse")
    public ResponseEntity<StandardResponse> getAllResultsWithCourse(@RequestParam Long degreeProgramId,@RequestParam String courseCode) {
        return gradingService.getPublishedExaminationDetailsUsingCourse(degreeProgramId, courseCode);
    }
    @GetMapping("/allResultsWithCourseAndYear")
    public ResponseEntity<StandardResponse> getAllResultsWithCourseAndYear(@RequestParam Long degreeProgramId,@RequestParam String courseCode,@RequestParam int year) {
        return gradingService.getpublishedDataByCourseAndYear(degreeProgramId,courseCode,year);
    }
    @GetMapping("/resultsByProgramAndYear")
    public ResponseEntity<StandardResponse> getResultsByProgramAndYear(@RequestParam Long degreeProgramId, @RequestParam int year) {
        return gradingService.getPublishedDataByProgramIdAndYear(degreeProgramId, year);
    }







}
