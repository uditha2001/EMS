package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.EncryptedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.service.FileService;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
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
            @RequestParam("creatorId") Long creatorId,
            @RequestParam("courseIds") List<Long> courseIds,
            @RequestParam("remarks") String remarks,
            @RequestParam("moderatorId") Long moderatorId) {
        try {
            // Validate courseIds
            if (courseIds == null || courseIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "At least one course must be selected.", null));
            }

            // Ensure only creator can upload the paper
            Optional<UserEntity> userEntityOptional = fileService.userRepository.findById(creatorId);
            if (userEntityOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Invalid creator ID.", null));
            }

            // Validate file type
            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Invalid file type. Only PDF files are allowed.", null));
            }

            // Encrypt and save file
            String encryptedFile = fileService.uploadAndEncryptFileForUsers(file, creatorId, moderatorId);
            fileService.saveEncryptedPaper(encryptedFile, creatorId, file.getOriginalFilename(), moderatorId, courseIds, remarks);

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "File uploaded and encrypted successfully.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error uploading file: " + e.getMessage(), null));
        }
    }



    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadEncryptedFile(
            @PathVariable Long id,
            @RequestParam("moderatorId") Long moderatorId) {
        try {
            EncryptedPaper encryptedPaper = fileService.getEncryptedPaperById(id);

            if (encryptedPaper == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new StandardResponse(404, "Paper not found.", null));
            }

            byte[] decryptedData = fileService.decryptFileForUser(moderatorId, encryptedPaper.getFilePath());

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + encryptedPaper.getFileName())
                    .body(decryptedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error downloading file: " + e.getMessage(), null));
        }
    }


    @GetMapping
    public ResponseEntity<StandardResponse> getAllPapers() {
        try {
            List<EncryptedPaper> papers = fileService.getAllEncryptedPapers();
            List<EncryptedPaperDTO> paperDTOs = papers.stream()
                    .map(paper -> new EncryptedPaperDTO(
                            paper.getId(),
                            paper.getFileName(),
                            paper.isShared(),
                            paper.getRemarks(),
                            paper.getSharedAt(),
                            paper.getCreator(),
                            paper.getModerator()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new StandardResponse(200, "Papers retrieved successfully.", paperDTOs), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new StandardResponse(500, "Error retrieving papers: " + e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deletePaper(@PathVariable Long id) {
        try {
            fileService.deletePaperById(id);
            return new ResponseEntity<>(new StandardResponse(200, "Paper deleted successfully.", null), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new StandardResponse(500, "Error deleting paper: " + e.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
