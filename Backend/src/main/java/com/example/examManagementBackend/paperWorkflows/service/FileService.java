package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private EncryptionService encryptionService;

    @Autowired
    private EncryptedPaperRepository encryptedPaperRepository;

    @Autowired
    private UserManagementRepo userRepository;

    // Method to upload and encrypt file
    public String uploadAndEncryptFile(MultipartFile file, Long userId) throws Exception {
        // Ensure the user exists and fetch the user entity
        Optional<UserEntity> userEntityOptional = userRepository.findById(userId);
        if (userEntityOptional.isEmpty()) {
            throw new Exception("User not found for ID: " + userId);
        }
        UserEntity creator = userEntityOptional.get();

        // Ensure the user's key pair exists
        encryptionService.ensureKeyPairExists(userId);

        // Read file bytes
        byte[] fileBytes = file.getBytes();

        // Encrypt the file
        return encryptionService.encrypt(userId, fileBytes);
    }

    // Method to save the encrypted paper
    public void saveEncryptedPaper(String encryptedFile, Long userId, String fileName,Long moderator) {
        EncryptedPaper encryptedPaper = new EncryptedPaper();
        encryptedPaper.setFileName(fileName);
        encryptedPaper.setEncryptedData(encryptedFile.getBytes()); // Store as byte array
        encryptedPaper.setCreator(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        encryptedPaper.setModerator(userRepository.findById(moderator).orElseThrow(() -> new RuntimeException("Moderator not found")));
        encryptedPaper.setEncryptionKey(encryptionService.getPublicKeyForUser(userId)); // Optional if needed for reference

        encryptedPaperRepository.save(encryptedPaper);
    }

    // Method to decrypt file
    public byte[] decryptFile(Long userId, byte[] encryptedData) throws Exception {
        return encryptionService.decrypt(userId, encryptedData);
    }

    // Method to get a paper by ID
    public EncryptedPaper getEncryptedPaperById(Long id) {
        return encryptedPaperRepository.findById(id).orElse(null);
    }

    // Method to get all encrypted papers
    public List<EncryptedPaper> getAllEncryptedPapers() {
        return encryptedPaperRepository.findAll();
    }

    // Method to delete paper by ID
    public void deletePaperById(Long id) {
        encryptedPaperRepository.deleteById(id);
    }

    // Method to get public key for user
    public String getPublicKeyForUser(Long userId) {
        return encryptionService.getPublicKeyForUser(userId);
    }
}
