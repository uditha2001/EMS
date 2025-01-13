package com.example.examManagementBackend.paperWorkflows.dto;

import java.time.LocalDateTime;

public class EncryptedPaperDTO {

    private Long id;
    private String fileName;
    private boolean isShared;
    private String encryptionKey;
    private LocalDateTime sharedAt;

    // Constructor for converting entity to DTO
    public EncryptedPaperDTO(Long id, String fileName, boolean isShared, String encryptionKey, LocalDateTime sharedAt) {
        this.id = id;
        this.fileName = fileName;
        this.isShared = isShared;
        this.encryptionKey = encryptionKey;
        this.sharedAt = sharedAt;
    }

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public boolean isShared() {
        return isShared;
    }

    public void setShared(boolean shared) {
        isShared = shared;
    }

    public String getEncryptionKey() {
        return encryptionKey;
    }

    public void setEncryptionKey(String encryptionKey) {
        this.encryptionKey = encryptionKey;
    }

    public LocalDateTime getSharedAt() {
        return sharedAt;
    }

    public void setSharedAt(LocalDateTime sharedAt) {
        this.sharedAt = sharedAt;
    }
}
