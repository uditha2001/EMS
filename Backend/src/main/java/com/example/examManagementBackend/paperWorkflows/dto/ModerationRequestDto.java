package com.example.examManagementBackend.paperWorkflows.dto;

public class ModerationRequestDto {
    private Long examPaperId;
    private Long moderatorId;

    // Getters and Setters
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
}