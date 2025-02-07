package com.example.examManagementBackend.paperWorkflows.controller;
import com.example.examManagementBackend.utill.StandardResponse;
import com.example.examManagementBackend.paperWorkflows.dto.ArchivedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.dto.UploadPaperRequestDTO;
import com.example.examManagementBackend.paperWorkflows.service.PaperArchivingService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/papers")
public class PaperArchivingController {

    private final PaperArchivingService paperArchivingService;

    public PaperArchivingController(PaperArchivingService paperArchivingService) {
        this.paperArchivingService = paperArchivingService;
    }

    @GetMapping("/archived")
    public ResponseEntity<StandardResponse> getArchivedPapers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ArchivedPaperDTO> papers = paperArchivingService.getArchivedPapers(page, size);
        return ResponseEntity.ok(new StandardResponse(200, "Archived papers retrieved successfully", papers));
    }

    @GetMapping("/archived/{id}")
    public ResponseEntity<StandardResponse> getArchivedPaperById(@PathVariable Long id) {
        Optional<ArchivedPaperDTO> paper = paperArchivingService.getArchivedPaperById(id);
        return paper.map(p -> ResponseEntity.ok(new StandardResponse(200, "Paper retrieved successfully", p)))
                .orElse(ResponseEntity.status(404).body(new StandardResponse(404, "Paper not found", null)));
    }

    @PostMapping("/archive")
    public ResponseEntity<StandardResponse> archivePapersManually() {
        paperArchivingService.archiveSharedPapers();
        return ResponseEntity.ok(new StandardResponse(200, "Paper archiving triggered successfully", null));
    }

    @DeleteMapping("/archived/{id}")
    public ResponseEntity<StandardResponse> deleteArchivedPaper(@PathVariable Long id) {
        paperArchivingService.deleteArchivedPaper(id);
        return ResponseEntity.ok(new StandardResponse(200, "Archived paper deleted successfully", null));
    }

    @GetMapping("/archived/{id}/download")
    public ResponseEntity<Resource> downloadArchivedPaper(@PathVariable Long id) {
        Optional<String> filePathOpt = paperArchivingService.getArchivedFilePath(id);

        if (filePathOpt.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        try {
            Path filePath = Paths.get(filePathOpt.get());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(404).body(null);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @PostMapping("/archived/upload")
    public ResponseEntity<StandardResponse> uploadArchivedPaper(
            @RequestParam("file") MultipartFile file,
            @ModelAttribute UploadPaperRequestDTO uploadRequest) {
        try {
            paperArchivingService.uploadArchivedPaper(file, uploadRequest);
            return ResponseEntity.ok(new StandardResponse(200, "Paper uploaded successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new StandardResponse(500, "Error uploading file: " + e.getMessage(), null));
        }
    }
}
