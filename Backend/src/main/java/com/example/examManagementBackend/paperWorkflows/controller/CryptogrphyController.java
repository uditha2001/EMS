package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.service.CryptographyService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.PublicKey;

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

    @PostMapping("/savePublicKey")
    public ResponseEntity<StandardResponse> savePublicKey(HttpServletRequest request, @RequestParam("publicKey") PublicKey publicKey) {
        return cryptographyService.savePublicKey(publicKey,request);
    }
}
