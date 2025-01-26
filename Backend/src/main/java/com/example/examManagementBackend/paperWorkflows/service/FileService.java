package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.paperWorkflows.entity.PapersCoursesEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.PapersCoursesRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FileService {

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    @Autowired
    public UserManagementRepo userRepository;

    @Autowired
    CoursesRepository coursesRepository;

    @Autowired
    PapersCoursesRepository papersCoursesRepository;

    @Autowired
    ExaminationRepository examinationRepository;

    private final String UPLOAD_DIR = "src/main/resources/Encrypted_Papers/";

    public void saveEncryptedPaper(String encryptedFile, Long creatorId, String fileName, Long moderatorId, List<Long> courseIds, String remarks, Long examinationId) {
        // Validate courseIds
        if (courseIds == null || courseIds.isEmpty()) {
            throw new IllegalArgumentException("Course IDs cannot be null or empty.");
        }

        // Validate examinationId
        ExaminationEntity examination = examinationRepository.findById(examinationId)
                .orElseThrow(() -> new RuntimeException("Academic year with ID " + examinationId + " not found."));

        // Create and populate the EncryptedPaper entity
        EncryptedPaper encryptedPaper = new EncryptedPaper();
        encryptedPaper.setFileName(fileName);

        // Save the file to the storage location and set the path
        String filePath = saveFileToStorage(encryptedFile, fileName);
        encryptedPaper.setFilePath(filePath);

        // Fetch and set creator
        encryptedPaper.setCreator(userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found.")));

        // Fetch and set moderator
        encryptedPaper.setModerator(userRepository.findById(moderatorId)
                .orElseThrow(() -> new RuntimeException("Moderator not found.")));

        encryptedPaper.setRemarks(remarks);
        encryptedPaper.setExamination(examination);

        // Save the EncryptedPaper entity
        encryptedPaperRepository.save(encryptedPaper);

        // Associate the paper with the selected courses
        for (Long courseId : courseIds) {
            CoursesEntity course = coursesRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course with ID " + courseId + " not found."));

            PapersCoursesEntity papersCoursesEntity = new PapersCoursesEntity();
            papersCoursesEntity.setEncryptedPaper(encryptedPaper);
            papersCoursesEntity.setCourse(course);
            papersCoursesRepository.save(papersCoursesEntity);
        }
    }

    public void updateEncryptedPaper(Long paperId, String encryptedFile, String fileName, String remarks) {
        // Retrieve the existing paper
        EncryptedPaper existingPaper = encryptedPaperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found with ID: " + paperId));

        // If the file name is different, delete the old file from the system
        if (!existingPaper.getFileName().equals(fileName)) {
            try {
                Files.deleteIfExists(Paths.get(existingPaper.getFilePath()));
            } catch (IOException e) {
                throw new RuntimeException("Failed to delete existing file: " + e.getMessage());
            }
        }

        // Save the new file to the storage and get the path
        String filePath = saveFileToStorage(encryptedFile, fileName);

        // Update the paper fields
        existingPaper.setFileName(fileName);
        existingPaper.setFilePath(filePath);
        existingPaper.setRemarks(remarks);

        // Save the updated paper record
        encryptedPaperRepository.save(existingPaper);
    }


    private String saveFileToStorage(String encryptedFile, String fileName) {
        // Validate the file name to prevent path traversal
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            throw new IllegalArgumentException("Invalid file name");
        }

        // Store the encrypted file to a location and return the file path
        try {
            Path path = Paths.get(UPLOAD_DIR).resolve(fileName).normalize();
            if (!path.startsWith(Paths.get(UPLOAD_DIR).normalize())) {
                throw new IllegalArgumentException("Invalid file name");
            }
            Files.write(path, encryptedFile.getBytes()); // Save file bytes
            return path.toString(); // Return file path
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    public EncryptedPaper getEncryptedPaperById(Long id) {
        return encryptedPaperRepository.findById(id).orElse(null);
    }

    public List<EncryptedPaper> getAllEncryptedPapers() {
        return encryptedPaperRepository.findAll();
    }

    public void deletePaperById(Long id) {
        EncryptedPaper encryptedPaper = encryptedPaperRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paper not found"));

        // Delete the file from the file system
        try {
            Files.deleteIfExists(Paths.get(encryptedPaper.getFilePath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }

        // Delete the database record
        encryptedPaperRepository.deleteById(id);
    }


    public String uploadAndEncryptFileForUsers(MultipartFile file, Long creatorId, Long moderatorId) throws Exception {

        byte[] fileBytes = file.getBytes();
        return encryptionService.encryptForMultipleUsers(creatorId, moderatorId, fileBytes);
    }

    public byte[] decryptFileForUser(Long userId, String filePath) throws Exception {
        try {
            // Read the file content
            byte[] fileBytes = Files.readAllBytes(Paths.get(filePath));
            String base64EncodedFile = new String(fileBytes, StandardCharsets.UTF_8);
            // Decrypt the file content
            return encryptionService.decryptForUser(userId, base64EncodedFile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the file: " + e.getMessage());
        }
    }

    public void updatePaperStatus(Long paperId, String status) {
        // Retrieve the paper by ID
        EncryptedPaper paper = encryptedPaperRepository.findById(paperId)
                .orElseThrow(() -> new IllegalArgumentException("Paper not found with ID: " + paperId));

        // Update the status
        paper.setStatus(ExamPaperStatus.valueOf(status));

        // Save the updated paper
        encryptedPaperRepository.save(paper);
    }


}
