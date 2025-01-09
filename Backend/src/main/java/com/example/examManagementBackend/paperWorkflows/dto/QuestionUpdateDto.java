package com.example.examManagementBackend.paperWorkflows.dto;

public class QuestionUpdateDto {
    private String updatedText;
    private String feedback;
    private String status;

    // Getters and Setters
    public String getUpdatedText() {
        return updatedText;
    }

    public void setUpdatedText(String updatedText) {
        this.updatedText = updatedText;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
