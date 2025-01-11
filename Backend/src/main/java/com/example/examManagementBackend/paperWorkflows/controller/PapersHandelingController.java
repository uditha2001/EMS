package com.example.examManagementBackend.paperWorkflows.controller;


import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/paper")
public class PapersHandelingController {

    @PostMapping("/generateKeys")
    public ResponseEntity<StandardResponse> generateKeys() {

        return  null;
    }
}
