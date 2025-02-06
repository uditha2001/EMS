package com.example.examManagementBackend.paperWorkflows.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArchivedPaperDTO {
    private Long id;
    private String fileName;
    private String filePath;
    private String remarks;
    private String creatorName;
    private String moderatorName;
    private LocalDateTime sharedAt;
    private LocalDateTime createdAt;
}
