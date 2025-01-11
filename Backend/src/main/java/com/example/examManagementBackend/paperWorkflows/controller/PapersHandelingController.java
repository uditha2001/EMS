package com.example.examManagementBackend.paperWorkflows.controller;


import com.example.examManagementBackend.paperWorkflows.service.PapersHandelingService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/paper")
public class PapersHandelingController {

    @Autowired
    PapersHandelingService papersHandelingService;
    @PostMapping("/generateKeys")
    public ResponseEntity<StandardResponse> generateKeys() {
        return papersHandelingService.generateKeys();
    }
}