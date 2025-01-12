package com.example.examManagementBackend.paperWorkflows.controller;


import com.example.examManagementBackend.paperWorkflows.service.CryptographyService;
import com.example.examManagementBackend.paperWorkflows.service.PapersHandelingService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/paper")
public class PapersHandelingController {

    private final PapersHandelingService papersHandelingService;
    @Autowired
    public PapersHandelingController(PapersHandelingService papersHandelingService) {
        this.papersHandelingService = papersHandelingService;
    }



    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> upload(@RequestParam("paperFile") MultipartFile paperFile,@RequestParam("fileName")String fileName,@RequestParam("courseCode") String courseCode,HttpServletRequest request) {
        String OriginalFileName=fileName;
        return papersHandelingService.saveFile(paperFile,OriginalFileName,courseCode,request);
    }


}
