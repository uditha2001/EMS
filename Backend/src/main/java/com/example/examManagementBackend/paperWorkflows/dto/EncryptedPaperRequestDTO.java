package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EncryptedPaperRequestDTO {

    // Getters and setters...
    private String fileName;
    private byte[] encryptedData;
    private Long creatorId;
    private String encryptionKey;

    // Constructor
    public EncryptedPaperRequestDTO(String fileName, byte[] encryptedData, Long creatorId, String encryptionKey) {
        this.fileName = fileName;
        this.encryptedData = encryptedData;
        this.creatorId = creatorId;
        this.encryptionKey = encryptionKey;
    }

}
