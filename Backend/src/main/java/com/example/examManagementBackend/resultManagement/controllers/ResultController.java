package com.example.examManagementBackend.resultManagement.controllers;

import com.example.examManagementBackend.resultManagement.dto.ResultDTO;
import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import com.example.examManagementBackend.resultManagement.services.ResultService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return  resultService.saveFirstMarkingResults(results,request);
    }

    @GetMapping("/getFirstMarking")
    public ResponseEntity<StandardResponse> getFirstMarkings(@RequestParam  String examName,@RequestParam String courseCode,@RequestParam ExamTypesName examType){
        return resultService.getFirstMarking(courseCode,examName,examType);
    }

}
