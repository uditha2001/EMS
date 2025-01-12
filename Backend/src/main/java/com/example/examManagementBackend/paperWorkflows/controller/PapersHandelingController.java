package com.example.examManagementBackend.paperWorkflows.controller;


import com.example.examManagementBackend.paperWorkflows.service.CryptographyService;
import com.example.examManagementBackend.paperWorkflows.service.PapersHandelingService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/v1/paper")
public class PapersHandelingController {

    private final PapersHandelingService papersHandelingService;
    private final CryptographyService cryptographyService;
    @Autowired
    public PapersHandelingController(PapersHandelingService papersHandelingService, CryptographyService cryptographyService) {
        this.papersHandelingService = papersHandelingService;
        this.cryptographyService = cryptographyService;
    }

    @PostMapping("/generateKeys")
    public ResponseEntity<StandardResponse> generateKeys(HttpServletRequest request) {
        return cryptographyService.generateAESKey(request);
    }

    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> upload(@RequestParam("paperFile") MultipartFile paperFile,@RequestParam("fileName")String fileName,@RequestParam("courseCode") String courseCode,HttpServletRequest request) {
        String OriginalFileName=fileName;
        return papersHandelingService.saveFile(paperFile,OriginalFileName,courseCode,request);
    }

}
