package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class EncryptedPaperDTO {

    private Long id;
    private String fileName;
    private boolean isShared;
    private LocalDateTime createdAt;
    private String remarks;
    private UserDTO creator;
    private UserDTO moderator;
    private Long examination;
    private CourseDTO course;
    private ExamPaperStatus status;
    private PaperType paperType;
    private String feedback;
    private String markingFilePath;

    // Constructor for converting entity to DTO
    public EncryptedPaperDTO(
            Long id,
            String fileName,
            boolean isShared,
            String remarks,
            LocalDateTime createdAt,
            UserEntity creator,
            UserEntity moderator,
            ExaminationEntity examination,
            CoursesEntity course,
            ExamPaperStatus status,
            PaperType paperType,
            String feedback,
            String markingFilePath

    ) {
        this.id = id;
        this.fileName = fileName;
        this.isShared = isShared;
        this.remarks = remarks;
        this.createdAt = createdAt;
        this.creator = (creator != null) ? new UserDTO(creator.getUserId(), creator.getFirstName(), creator.getLastName()) : null;
        this.moderator = (moderator != null) ? new UserDTO(moderator.getUserId(), moderator.getFirstName(), moderator.getLastName()) : null;
        this.examination = (examination != null) ? examination.getId() : null;
        this.course = (course != null) ? new CourseDTO(course.getId(), course.getName(), course.getCode()) : null;
        this.status = status;
        this.paperType = paperType;
        this.feedback=feedback;
        this.markingFilePath = markingFilePath;
    }

    @Data
    @NoArgsConstructor
    public static class UserDTO {
        private Long id;
        private String firstName;
        private String lastName;

        public UserDTO(Long id, String firstName, String lastName) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
        }
    }

    @Data
    @NoArgsConstructor
    public static class CourseDTO {
        private Long id;
        private String name;
        private String code;

        public CourseDTO(Long id, String name, String code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }
    }
}