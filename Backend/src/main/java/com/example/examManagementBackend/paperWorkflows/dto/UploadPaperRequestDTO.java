package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;

@Data
public class UploadPaperRequestDTO {
    private String remarks;
    private Long creatorId;
    private Long moderatorId;
    private Long examinationId;
}
