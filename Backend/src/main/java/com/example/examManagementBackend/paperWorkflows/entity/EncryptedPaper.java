package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
public class EncryptedPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String courseCode;

    private String remarks;

    @Lob
    private byte[] encryptedData; // Store encrypted PDF data as Base64 encoded string

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator; // Reference to the creator of the paper

    @ManyToOne
    @JoinColumn(name = "moderator_id", nullable = true)
    private UserEntity moderator; // Reference to the moderator (optional initially)

    @Column(nullable = false)
    private boolean isShared = false; // Sharing status

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime sharedAt; // Timestamp when the paper was shared
    public EncryptedPaper() {
        // Default constructor for JPA
    }

    public EncryptedPaper(String fileName, byte[] encryptedData, UserEntity creator, String encryptionKey) {
        this.fileName = fileName;
        this.encryptedData = encryptedData;
        this.creator = creator;

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

    public byte[] getEncryptedData() {
        return encryptedData;
    }

    public void setEncryptedData(byte[] encryptedData) {
        this.encryptedData = encryptedData;
    }

    public UserEntity getCreator() {
        return creator;
    }

    public void setCreator(UserEntity creator) {
        this.creator = creator;
    }

    public UserEntity getModerator() {
        return moderator;
    }

    public void setModerator(UserEntity moderator) {
        this.moderator = moderator;
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
