package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.ArchivedPaperDTO;
import com.example.examManagementBackend.paperWorkflows.dto.UploadPaperRequestDTO;
import com.example.examManagementBackend.paperWorkflows.entity.ArchivedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ArchivedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaperArchivingService {

    private final Path storagePath = Paths.get("src/main/resources/Archived_Papers/");

    private final EncryptedPaperRepository encryptedPaperRepository;

    private final ArchivedPaperRepository archivedPaperRepository;

    private final EncryptionService encryptionService;

    private final UserManagementRepo userRepository;

    private final ExaminationRepository examinationRepository;

    public PaperArchivingService(EncryptedPaperRepository encryptedPaperRepository, ArchivedPaperRepository archivedPaperRepository, EncryptionService encryptionService, UserManagementRepo userRepository, ExaminationRepository examinationRepository) {
        this.encryptedPaperRepository = encryptedPaperRepository;
        this.archivedPaperRepository = archivedPaperRepository;
        this.encryptionService = encryptionService;
        this.userRepository = userRepository;
        this.examinationRepository = examinationRepository;
    }

    @Scheduled(fixedRate = 86400000) // Runs once every 24 hours
    @Transactional
   // @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
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
                archivedPaper.setCourse(encryptedPaper.getCourse());
                archivedPaper.setPaperType(encryptedPaper.getPaperType());

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


    public Page<ArchivedPaperDTO> getArchivedPapers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ArchivedPaper> archivedPapers = archivedPaperRepository.findAll(pageable);

        return archivedPapers.map(this::convertToDTO);
    }

    public Optional<ArchivedPaperDTO> getArchivedPaperById(Long id) {
        return archivedPaperRepository.findById(id).map(this::convertToDTO);
    }

    public void deleteArchivedPaper(Long id) {
        archivedPaperRepository.deleteById(id);
    }

    private ArchivedPaperDTO convertToDTO(ArchivedPaper archivedPaper) {
        ArchivedPaperDTO dto = new ArchivedPaperDTO();
        dto.setId(archivedPaper.getId());
        dto.setFileName(archivedPaper.getFileName());
        dto.setFilePath(archivedPaper.getFilePath());
        dto.setRemarks(archivedPaper.getRemarks());
        dto.setCreatorName(archivedPaper.getCreator().getUsername());
        dto.setModeratorName(archivedPaper.getModerator().getUsername());
        dto.setSharedAt(archivedPaper.getSharedAt());
        dto.setCreatedAt(archivedPaper.getCreatedAt());
        dto.setPaperType(String.valueOf(archivedPaper.getPaperType()));
        dto.setCourseCode(archivedPaper.getCourse().getCode());
        dto.setCourseName(archivedPaper.getCourse().getName());
        dto.setExamination(archivedPaper.getExamination().getYear()+" "+ archivedPaper.getExamination().getLevel()+" " +archivedPaper.getExamination().getSemester()+" "+ archivedPaper.getExamination().getDegreeProgramsEntity().getDegreeName() );
        return dto;
    }

    public Optional<String> getArchivedFilePath(Long id) {
        return archivedPaperRepository.findById(id).map(ArchivedPaper::getFilePath);
    }

    public void uploadArchivedPaper(MultipartFile file, UploadPaperRequestDTO uploadRequest) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty.");
        }

        // Ensure storage directory exists
        if (!Files.exists(storagePath)) {
            Files.createDirectories(storagePath);
        }

        // Validate filename to prevent path traversal attacks
        String originalFilename = file.getOriginalFilename();
        if (originalFilename.contains("..") || originalFilename.contains("/") || originalFilename.contains("\\")) {
            throw new IllegalArgumentException("Invalid filename");
        }

        // Save file to storage
        Path filePath = storagePath.resolve(originalFilename).normalize();
        if (!filePath.startsWith(storagePath)) {
            throw new IllegalArgumentException("Invalid file path");
        }
        Files.write(filePath, file.getBytes());

        // Fetch associated entities
        UserEntity creator = userRepository.findById(uploadRequest.getCreatorId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid creator ID."));
        UserEntity moderator = userRepository.findById(uploadRequest.getModeratorId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid moderator ID."));
        ExaminationEntity examination = examinationRepository.findById(uploadRequest.getExaminationId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid examination ID."));

        // Save to database
        ArchivedPaper archivedPaper = new ArchivedPaper();
        archivedPaper.setFileName(file.getOriginalFilename());
        archivedPaper.setFilePath(filePath.toString());
        archivedPaper.setRemarks(uploadRequest.getRemarks());
        archivedPaper.setCreator(creator);
        archivedPaper.setModerator(moderator);
        archivedPaper.setExamination(examination);
        archivedPaper.setCreatedAt(LocalDateTime.now());

        archivedPaperRepository.save(archivedPaper);
    }
}

