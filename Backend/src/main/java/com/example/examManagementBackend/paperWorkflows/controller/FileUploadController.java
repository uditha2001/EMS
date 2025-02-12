package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.EncryptedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.dto.EncryptedPaperViewRequestDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.paperWorkflows.service.FileService;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/papers")
public class FileUploadController {

    private final FileService fileService;

    public FileUploadController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<StandardResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("creatorId") Long creatorId,
            @RequestParam("courseId") Long courseId,  // Single course ID
            @RequestParam("remarks") String remarks,
            @RequestParam("paperType") String paperType,
            @RequestParam("moderatorId") Long moderatorId,
            @RequestParam("examinationId") Long examinationId) {
        try {
            // Validate courseId
            CoursesEntity course = fileService.coursesRepository.findById(courseId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid course ID."));

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
            fileService.saveEncryptedPaper(encryptedFile, creatorId, file.getOriginalFilename(), moderatorId, courseId, remarks, examinationId, paperType);

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "File uploaded and encrypted successfully.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new StandardResponse(400, e.getMessage(), null));
        } catch (Exception e) {
            // Log error for debugging purposes
            e.printStackTrace();
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

                        // Construct the DTO
                        return new EncryptedPaperDTO(
                                paper.getId(),
                                paper.getFileName(),
                                paper.isShared(),
                                paper.getRemarks(),
                                paper.getCreatedAt(),
                                paper.getCreator(),
                                paper.getModerator(),
                                paper.getExamination(),
                                paper.getCourse(),
                                paper.getStatus(),
                                paper.getPaperType(),
                                paper.getFeedback()
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
            // Retrieve the existing paper details
            EncryptedPaper existingPaper = fileService.getEncryptedPaperById(id);

            if (existingPaper == null) {
                return new ResponseEntity<>(new StandardResponse(400, "Paper not found with the provided id.", null), HttpStatus.BAD_REQUEST);
            }

            // Check if the paper is approved
            if (existingPaper.getStatus().toString().equals("APPROVED")) {
                return new ResponseEntity<>(new StandardResponse(400, "Cannot delete the paper. It has already been approved.", null), HttpStatus.BAD_REQUEST);
            }

            // Proceed with deletion if not approved
            fileService.deletePaperById(id);

            return new ResponseEntity<>(new StandardResponse(200, "Paper deleted successfully.", null), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new StandardResponse(500, "Error deleting paper: ", null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/view")
    public ResponseEntity<?> viewEncryptedFile(@RequestBody EncryptedPaperViewRequestDTO request) {
        try {
            EncryptedPaper encryptedPaper = fileService.getEncryptedPaperById(request.getId());

            if (encryptedPaper == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new StandardResponse(404, "Paper not found.", null));
            }

            byte[] decryptedData = fileService.decryptFileForUser(request.getModeratorId(), encryptedPaper.getFilePath());

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "inline; filename=" + encryptedPaper.getFileName())
                    .body(decryptedData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error viewing file", null));
        }
    }


    @PutMapping("/update/{fileId}")
    public ResponseEntity<StandardResponse> updatePaper(
            @PathVariable Long fileId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileName") String fileName,
            @RequestParam("remarks") String remarks) {

        try {
            // Validate file type
            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Invalid file type. Only PDF files are allowed.", null));
            }

            // Retrieve existing paper details
            EncryptedPaper existingPaper = fileService.getEncryptedPaperById(fileId);
            if (existingPaper == null) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Paper not found with the provided fileId.", null));
            }

            // Check if the paper is approved
            if (existingPaper.getStatus().toString().equals("APPROVED")) {
                return ResponseEntity.badRequest()
                        .body(new StandardResponse(400, "Cannot update the paper. It has already been approved.", null));
            }


            // Get creatorId and moderatorId from the existing paper
            Long creatorId = existingPaper.getCreator().getUserId();
            Long moderatorId = existingPaper.getModerator().getUserId();

            // Encrypt the file before saving it
            String encryptedFile = fileService.uploadAndEncryptFileForUsers(file, creatorId, moderatorId);

            // Update the paper with the new file, file name, and remarks
            fileService.updateEncryptedPaper(fileId, encryptedFile, fileName, remarks);

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "Paper updated successfully", null));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new StandardResponse(400, e.getMessage(), null));
        } catch (Exception e) {
            // Log error for debugging purposes
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error updating file: ", null));
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


            // Create a DTO to send relevant paper data
            EncryptedPaperDTO paperDTO = new EncryptedPaperDTO(
                    encryptedPaper.getId(),
                    encryptedPaper.getFileName(),
                    encryptedPaper.isShared(),
                    encryptedPaper.getRemarks(),
                    encryptedPaper.getCreatedAt(),
                    encryptedPaper.getCreator(),
                    encryptedPaper.getModerator(),
                    encryptedPaper.getExamination(),
                    encryptedPaper.getCourse(),
                    encryptedPaper.getStatus(),
                    encryptedPaper.getPaperType(),
                    encryptedPaper.getFeedback()// Pass the list of courses here
            );

            return ResponseEntity.ok()
                    .body(new StandardResponse(200, "Paper retrieved successfully.", paperDTO));

        } catch (Exception e) {
            // Log error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error retrieving paper: ", null));

        }


    }

    @GetMapping("/{id}/status")
    public ResponseEntity<StandardResponse> getPaperStatus(@PathVariable Long id) {
        ExamPaperStatus status = fileService.getPaperStatus(id);
        return ResponseEntity.ok(new StandardResponse(200, "Paper status retrieved successfully", status));
    }
}
