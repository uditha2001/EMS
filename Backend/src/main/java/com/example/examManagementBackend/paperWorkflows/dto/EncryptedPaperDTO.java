package com.example.examManagementBackend.paperWorkflows.dto;

import java.time.LocalDateTime;

public class EncryptedPaperDTO {

    private Long id;
    private String fileName;
    private boolean isShared;
    private LocalDateTime sharedAt;
    private String courseCode;
    private String remarks;

    // Constructor for converting entity to DTO
    public EncryptedPaperDTO(Long id, String fileName, boolean isShared, String courseCode,String remarks, LocalDateTime sharedAt) {
        this.id = id;
        this.fileName = fileName;
        this.isShared = isShared;
        this.courseCode = courseCode;
        this.remarks = remarks;
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


    public LocalDateTime getSharedAt() {
        return sharedAt;
    }

    public void setSharedAt(LocalDateTime sharedAt) {
        this.sharedAt = sharedAt;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
