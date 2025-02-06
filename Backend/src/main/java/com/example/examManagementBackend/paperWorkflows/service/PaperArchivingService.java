package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.ArchivedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.repository.ArchivedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaperArchivingService {

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    @Autowired
    private ArchivedPaperRepository archivedPaperRepository;

    @Autowired
    private EncryptionService encryptionService;

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void archiveSharedPapers() {
        LocalDateTime now = LocalDateTime.now();

        // Find papers whose sharedAt date has passed
        List<EncryptedPaper> expiredPapers = encryptedPaperRepository.findBySharedAtBefore(now);

        for (EncryptedPaper encryptedPaper : expiredPapers) {
            try {
                // Decrypt the file
                byte[] decryptedFile = encryptionService.decryptForUser(
                        encryptedPaper.getCreator().getUserId(),
                        Files.readString(Paths.get(encryptedPaper.getFilePath()), StandardCharsets.UTF_8)
                );

                // Save decrypted file in a new location
                String newFilePath = saveDecryptedFile(decryptedFile, encryptedPaper.getFileName());

                // Create and save an archived paper entry
                ArchivedPaper archivedPaper = new ArchivedPaper();
                archivedPaper.setFileName(encryptedPaper.getFileName());
                archivedPaper.setFilePath(newFilePath);
                archivedPaper.setRemarks(encryptedPaper.getRemarks());
                archivedPaper.setCreator(encryptedPaper.getCreator());
                archivedPaper.setModerator(encryptedPaper.getModerator());
                archivedPaper.setShared(encryptedPaper.isShared());
                archivedPaper.setSharedAt(encryptedPaper.getSharedAt());
                archivedPaper.setCreatedAt(encryptedPaper.getCreatedAt());
                archivedPaper.setUpdatedAt(encryptedPaper.getUpdatedAt());
                archivedPaper.setExamination(encryptedPaper.getExamination());

                archivedPaperRepository.save(archivedPaper);

                // Delete the encrypted paper record
                encryptedPaperRepository.delete(encryptedPaper);

                // Delete the encrypted file from storage
                Files.deleteIfExists(Paths.get(encryptedPaper.getFilePath()));

            } catch (Exception e) {
                throw new RuntimeException("Error archiving paper: " + encryptedPaper.getId(), e);
            }
        }
    }

    private String saveDecryptedFile(byte[] decryptedFile, String fileName) throws IOException {
        Path outputPath = Paths.get("src/main/resources/Archived_Papers/").resolve(fileName);
        Files.write(outputPath, decryptedFile);
        return outputPath.toString();
    }


}

