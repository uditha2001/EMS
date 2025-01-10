package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.service.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class FileUploadController {

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    // Endpoint to handle file upload and encryption
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Check if the file is a PDF
            if (!file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
            }

            // Encrypt the file content
            byte[] fileBytes = file.getBytes();
            String encryptedFile = encryptionService.encrypt(fileBytes);

            // Create a new EncryptedPaper entity
            EncryptedPaper encryptedPaper = new EncryptedPaper(file.getOriginalFilename(), encryptedFile);

            // Save the encrypted paper in the database
            encryptedPaperRepository.save(encryptedPaper);

            return ResponseEntity.ok("File uploaded and encrypted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }

    // Endpoint to download a file by ID
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadEncryptedFile(@PathVariable Long id) {
        EncryptedPaper encryptedPaper = encryptedPaperRepository.findById(id).orElse(null);

        if (encryptedPaper == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] encryptedBytes = Base64.getDecoder().decode(encryptedPaper.getEncryptedData());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + encryptedPaper.getFileName())
                    .body(encryptedBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error decrypting the file.".getBytes());
        }
    }

    // New Endpoint to get all papers
    @GetMapping("/papers")
    public ResponseEntity<List<EncryptedPaper>> getAllPapers() {
        try {
            List<EncryptedPaper> papers = encryptedPaperRepository.findAll();
            return ResponseEntity.ok(papers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // New Endpoint to delete a paper by ID
    @DeleteMapping("/papers/{id}")
    public ResponseEntity<String> deletePaper(@PathVariable Long id) {
        try {
            EncryptedPaper encryptedPaper = encryptedPaperRepository.findById(id).orElse(null);

            if (encryptedPaper == null) {
                return ResponseEntity.status(404).body("Paper not found.");
            }

            encryptedPaperRepository.deleteById(id);
            return ResponseEntity.ok("Paper deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting paper: " + e.getMessage());
        }
    }
}
