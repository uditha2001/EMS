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
    public UserManagementRepo userRepository;

    public String uploadAndEncryptFile(MultipartFile file, Long creatorId) throws Exception {
        Optional<UserEntity> userEntityOptional = userRepository.findById(creatorId);
        if (userEntityOptional.isEmpty()) {
            throw new Exception("User not found for ID: " + creatorId);
        }

        UserEntity creator = userEntityOptional.get();
        encryptionService.ensureKeyPairExists(creatorId);

        byte[] fileBytes = file.getBytes();
        return encryptionService.encrypt(creatorId, fileBytes);
    }

    public void saveEncryptedPaper(String encryptedFile, Long creatorId, String fileName, Long moderatorId) {
        EncryptedPaper encryptedPaper = new EncryptedPaper();
        encryptedPaper.setFileName(fileName);
        encryptedPaper.setEncryptedData(encryptedFile.getBytes());
        encryptedPaper.setCreator(userRepository.findById(creatorId).orElseThrow(() -> new RuntimeException("User not found")));
        encryptedPaper.setModerator(userRepository.findById(moderatorId).orElseThrow(() -> new RuntimeException("Moderator not found")));
        encryptedPaper.setEncryptionKey(encryptionService.getPublicKeyForUser(creatorId));
        encryptedPaperRepository.save(encryptedPaper);
    }

    public byte[] decryptFile(Long moderatorId, byte[] encryptedData) throws Exception {
        return encryptionService.decrypt(moderatorId, encryptedData);
    }

    public EncryptedPaper getEncryptedPaperById(Long id) {
        return encryptedPaperRepository.findById(id).orElse(null);
    }

    public List<EncryptedPaper> getAllEncryptedPapers() {
        return encryptedPaperRepository.findAll();
    }

    public void deletePaperById(Long id) {
        encryptedPaperRepository.deleteById(id);
    }

    public String getPublicKeyForUser(Long creatorId) {
        return encryptionService.getPublicKeyForUser(creatorId);
    }
}
