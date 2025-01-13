package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.EncryptedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.service.FileService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/papers")
public class FileUploadController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") Long userId,
            @RequestParam("moderator") Long moderator) {
        try {
            // Validate file type
            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Invalid file type. Only PDF files are allowed.", null));
            }

            // Encrypt and save file
            String encryptedFile = fileService.uploadAndEncryptFile(file, userId);
            fileService.saveEncryptedPaper(encryptedFile, userId, file.getOriginalFilename(), moderator);

            // Log success
            System.out.println("File uploaded and encrypted successfully.");

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "File uploaded and encrypted successfully.", null));
        } catch (Exception e) {
            // Log error
            System.err.println("Error during file upload: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error uploading file: " + e.getMessage(), null));
        }
    }



    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadEncryptedFile(@PathVariable Long id, @RequestParam("userId") Long userId) {
        EncryptedPaper encryptedPaper = fileService.getEncryptedPaperById(id);

        if (encryptedPaper == null) {
            return new ResponseEntity<>(new StandardResponse(404, "Paper not found.", null), HttpStatus.NOT_FOUND);
        }

        try {
            byte[] decryptedBytes = fileService.decryptFile(userId, encryptedPaper.getEncryptedData());

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + encryptedPaper.getFileName())
                    .header("Content-Type", "application/pdf") // Ensure proper content type is set
                    .body(decryptedBytes);
        } catch (Exception e) {
            return new ResponseEntity<>(new StandardResponse(500, "Error decrypting the file: " + e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping
    public ResponseEntity<StandardResponse> getAllPapers() {
        try {
            List<EncryptedPaper> papers = fileService.getAllEncryptedPapers();
            // Convert to DTOs
            List<EncryptedPaperDTO> paperDTOs = papers.stream()
                    .map(paper -> new EncryptedPaperDTO(
                            paper.getId(),
                            paper.getFileName(),
                            paper.isShared(),
                            paper.getEncryptionKey(),
                            paper.getSharedAt()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(
                    new StandardResponse(200, "Papers retrieved successfully.", paperDTOs),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new StandardResponse(500, "Error retrieving papers: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deletePaper(@PathVariable Long id) {
        try {
            fileService.deletePaperById(id);
            return new ResponseEntity<>(
                    new StandardResponse(200, "Paper deleted successfully.", null),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new StandardResponse(500, "Error deleting paper: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/public-key")
    public ResponseEntity<StandardResponse> getPublicKey(@RequestParam("userId") Long userId) {
        try {
            String publicKey = fileService.getPublicKeyForUser(userId);
            return new ResponseEntity<>(
                    new StandardResponse(200, "Public key retrieved successfully.", publicKey),
                    HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new StandardResponse(500, "Error fetching public key: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
