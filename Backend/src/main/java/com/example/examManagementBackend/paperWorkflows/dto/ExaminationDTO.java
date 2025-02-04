package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExaminationDTO {
    private Long id;
    private String year;
    private String level;
    private String semester;
    private Long degreeProgramId;
    private String degreeName;

    private LocalDateTime examProcessStartDate;
    private LocalDateTime paperSettingCompleteDate;
    private LocalDateTime markingCompleteDate;
    private ExamStatus status;
}
