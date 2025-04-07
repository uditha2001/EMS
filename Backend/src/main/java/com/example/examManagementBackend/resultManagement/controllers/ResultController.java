package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.resultManagement.dto.GradeDetailsDTO;
import com.example.examManagementBackend.resultManagement.dto.PublishedDataDTO;
import com.example.examManagementBackend.resultManagement.dto.ResultDTO;
import com.example.examManagementBackend.resultManagement.services.ResultService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/result")
public class ResultController {
    private final ResultService resultService;
    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/firstMarking")
    public ResponseEntity<StandardResponse> saveFirstMarking(@RequestBody ResultDTO results, HttpServletRequest request)
    {
        return  resultService.saveMarkingResults(results,request);
    }

    @GetMapping("/getFirstMarking")
    public ResponseEntity<StandardResponse> getFirstMarkings(@RequestParam  Long id,@RequestParam String courseCode,@RequestParam String examType){
        return resultService.getFirstMarking(courseCode,id,examType);
    }
    @PostMapping("/secondMarking")
    public ResponseEntity<StandardResponse> saveSecondMarking(@RequestBody ResultDTO results, HttpServletRequest request){
        return resultService.saveMarkingResults(results,request);
    }

    @GetMapping("/firstMarkerExamTypes")
    public ResponseEntity<StandardResponse> getFirstMarkerExamTypes(HttpServletRequest request,@RequestParam String courseCode,@RequestParam Long examId){
        return resultService.getAllAssignedExamsTypes(courseCode,request,examId,"FIRST_MARKER");
    }

    @PostMapping("/saveFinalResults")
    public ResponseEntity<StandardResponse> saveFinalResults(@RequestBody PublishedDataDTO publishedData, HttpServletRequest request) {
        return resultService.savePublishedResults(publishedData,request);
    }

}
