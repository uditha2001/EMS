package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import lombok.Data;

@Data
public class UploadPaperRequestDTO {
    private String fileName;
    private String filePath;
    private String remarks;
    private Long creatorId;
    private Long moderatorId;
    private Long examinationId;
    private Long courseId;
    private PaperType paperType;
}
