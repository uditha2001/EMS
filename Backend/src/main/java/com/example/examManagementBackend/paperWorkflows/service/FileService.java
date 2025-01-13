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


    public void saveEncryptedPaper(String encryptedFile, Long creatorId, String fileName, Long moderatorId) {
        EncryptedPaper encryptedPaper = new EncryptedPaper();
        encryptedPaper.setFileName(fileName);
        encryptedPaper.setEncryptedData(encryptedFile.getBytes());
        encryptedPaper.setCreator(userRepository.findById(creatorId).orElseThrow(() -> new RuntimeException("User not found")));
        encryptedPaper.setModerator(userRepository.findById(moderatorId).orElseThrow(() -> new RuntimeException("Moderator not found")));
        //encryptedPaper.setEncryptionKey(encryptionService.getPublicKeyForUser(creatorId));
        encryptedPaperRepository.save(encryptedPaper);
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

    public String uploadAndEncryptFileForUsers(MultipartFile file, Long creatorId, Long moderatorId) throws Exception {
        byte[] fileBytes = file.getBytes();
        return encryptionService.encryptForMultipleUsers(creatorId, moderatorId, fileBytes);
    }

    public byte[] decryptFileForUser(Long userId, byte[] encryptedData) throws Exception {
        return encryptionService.decryptForUser(userId, encryptedData);
    }
}
