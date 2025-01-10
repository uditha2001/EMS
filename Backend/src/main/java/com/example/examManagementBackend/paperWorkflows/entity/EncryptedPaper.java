package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;

@Entity
public class EncryptedPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private String encryptedData; // Store encrypted PDF data as Base64 encoded string

    public EncryptedPaper() {}

    public EncryptedPaper(String fileName, String encryptedData) {
        this.fileName = fileName;
        this.encryptedData = encryptedData;
    }

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

    public String getEncryptedData() {
        return encryptedData;
    }

    public void setEncryptedData(String encryptedData) {
        this.encryptedData = encryptedData;
    }
}

