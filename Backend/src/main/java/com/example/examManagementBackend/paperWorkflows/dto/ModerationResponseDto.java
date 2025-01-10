package com.example.examManagementBackend.paperWorkflows.dto;

import java.time.LocalDateTime;

public class ModerationResponseDto {
    private Long id;
    private Long examPaperId;
    private Long moderatorId;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExamPaperId() {
        return examPaperId;
    }

    public void setExamPaperId(Long examPaperId) {
        this.examPaperId = examPaperId;
    }

    public Long getModeratorId() {
        return moderatorId;
    }

    public void setModeratorId(Long moderatorId) {
        this.moderatorId = moderatorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
