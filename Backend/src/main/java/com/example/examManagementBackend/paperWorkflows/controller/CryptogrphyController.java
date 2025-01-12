package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.service.CryptographyService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/crypto")
public class CryptogrphyController {
    private final CryptographyService cryptographyService;
    public CryptogrphyController(CryptographyService cryptographyService) {
        this.cryptographyService = cryptographyService;
    }
    @GetMapping("/generateKeys")
    public ResponseEntity<StandardResponse> generateKeys(HttpServletRequest request) {
        return cryptographyService.generateAESKey(request);
    }
}
