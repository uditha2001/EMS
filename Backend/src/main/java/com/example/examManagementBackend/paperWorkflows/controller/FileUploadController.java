package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.EncryptedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.PapersCoursesEntity;
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
            @RequestParam("moderatorId") Long moderatorId,
            @RequestParam("academicYearId") Long academicYearId) {
        try {
            // Validate courseIds
            if (courseIds == null || courseIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "At least one course must be selected.", null));
            }

            // Validate creator existence
            UserEntity creator = fileService.userRepository.findById(creatorId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid creator ID."));

            // Validate moderator existence
            fileService.userRepository.findById(moderatorId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid moderator ID."));

            // Validate file type
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "No file provided.", null));
            }
            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Invalid file type. Only PDF files are allowed.", null));
            }

            // Encrypt and save file
            String encryptedFile = fileService.uploadAndEncryptFileForUsers(file, creatorId, moderatorId);
            fileService.saveEncryptedPaper(encryptedFile, creatorId, file.getOriginalFilename(), moderatorId, courseIds, remarks, academicYearId);

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "File uploaded and encrypted successfully.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new StandardResponse(400, e.getMessage(), null));
        } catch (Exception e) {
            // Log error for debugging purposes
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error uploading file: ", null));
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
                    .body(new StandardResponse(500, "Error downloading file: " , null));
        }
    }


    @GetMapping
    public ResponseEntity<StandardResponse> getAllPapers() {
        try {
            // Retrieve all encrypted papers
            List<EncryptedPaper> papers = fileService.getAllEncryptedPapers();

            // Map each paper to its corresponding DTO
            List<EncryptedPaperDTO> paperDTOs = papers.stream()
                    .map(paper -> {
                        // Extract courses associated with the paper
                        List<CoursesEntity> courses = paper.getPapersCourses()
                                .stream()
                                .map(PapersCoursesEntity::getCourse)
                                .toList();

                        // Construct the DTO
                        return new EncryptedPaperDTO(
                                paper.getId(),
                                paper.getFileName(),
                                paper.isShared(),
                                paper.getRemarks(),
                                paper.getCreatedAt(),
                                paper.getCreator(),
                                paper.getModerator(),
                                paper.getAcademicYear(),
                                courses, // Include courses in the DTO
                                paper.getStatus()
                        );
                    })
                    .collect(Collectors.toList());

            // Return the response with all DTOs
            return new ResponseEntity<>(new StandardResponse(200, "Papers retrieved successfully.", paperDTOs), HttpStatus.OK);

        } catch (Exception e) {
            // Handle any errors and return a 500 response
            return new ResponseEntity<>(new StandardResponse(500, "Error retrieving papers: ", null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deletePaper(@PathVariable Long id) {
        try {
            fileService.deletePaperById(id);
            return new ResponseEntity<>(new StandardResponse(200, "Paper deleted successfully.", null), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new StandardResponse(500, "Error deleting paper: " , null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewEncryptedFile(
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
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "inline; filename=" + encryptedPaper.getFileName())
                    .body(decryptedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error viewing file: ", null));
        }
    }

    @PutMapping("/{paperId}")
    public ResponseEntity<String> updatePaper(@PathVariable Long paperId,
                                              @RequestParam(required = false) String fileName,
                                              @RequestParam(required = false) String remarks
                                              ) {
        try {
            fileService.updateEncryptedPaper(paperId, fileName ,remarks);
            return ResponseEntity.ok("Paper updated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    @GetMapping("/{fileId}")
    public ResponseEntity<StandardResponse> getPaperById(@PathVariable Long fileId) {
        try {
            // Retrieve the paper details by its ID
            EncryptedPaper encryptedPaper = fileService.getEncryptedPaperById(fileId);

            // Check if the paper exists
            if (encryptedPaper == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new StandardResponse(404, "Paper not found.", null));
            }

            // Retrieve courses associated with the paper
            List<CoursesEntity> courses = encryptedPaper.getPapersCourses()
                    .stream()
                    .map(PapersCoursesEntity::getCourse)
                    .toList();

            // Create a DTO to send relevant paper data
            EncryptedPaperDTO paperDTO = new EncryptedPaperDTO(
                    encryptedPaper.getId(),
                    encryptedPaper.getFileName(),
                    encryptedPaper.isShared(),
                    encryptedPaper.getRemarks(),
                    encryptedPaper.getCreatedAt(),
                    encryptedPaper.getCreator(),
                    encryptedPaper.getModerator(),
                    encryptedPaper.getAcademicYear(),
                    courses,
                    encryptedPaper.getStatus()// Pass the list of courses here
            );

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "Paper retrieved successfully.", paperDTO));

        } catch (Exception e) {
            // Log error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error retrieving paper: ", null));
        
    }

    @PutMapping("/status/{paperId}")
    public ResponseEntity<StandardResponse> updatePaperStatus(
            @PathVariable Long paperId,
            @RequestParam("status") String status) {
        try {
            // Validate status
            if (status == null || status.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Status is required.", null));
            }

            // Update the paper status using the service
            fileService.updatePaperStatus(paperId, status);

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "Paper status updated successfully.", null));
        } catch (IllegalArgumentException e) {
            // Handle invalid input or paper not found
            return ResponseEntity.badRequest()
                    .body(new StandardResponse(400, e.getMessage(), null));
        } catch (Exception e) {
            // Log error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error updating paper status: " + e.getMessage(), null));
        }
    }



}
