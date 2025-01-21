package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.AcademicYearsEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamPaperStatus;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class EncryptedPaperDTO {

    private Long id;
    private String fileName;
    private boolean isShared;
    private LocalDateTime createdAt;
    private String remarks;
    private UserDTO creator;
    private UserDTO moderator;
    private Long academicYear;
    private List<CourseDTO> courses;
    private ExamPaperStatus status;

    // Constructor for converting entity to DTO
    public EncryptedPaperDTO(
            Long id,
            String fileName,
            boolean isShared,
            String remarks,
            LocalDateTime createdAt,
            UserEntity creator,
            UserEntity moderator,
            AcademicYearsEntity academicYear,
            List<CoursesEntity> courses,
            ExamPaperStatus status

    ) {
        this.id = id;
        this.fileName = fileName;
        this.isShared = isShared;
        this.remarks = remarks;
        this.createdAt = createdAt;
        this.creator = new UserDTO(creator.getUserId(), creator.getFirstName(), creator.getLastName());
        this.moderator = new UserDTO(moderator.getUserId(), moderator.getFirstName(), moderator.getLastName());
        this.academicYear = (academicYear != null) ? academicYear.getId() : null;
        this.courses = courses.stream()
                .map(course -> new CourseDTO(course.getId(), course.getName(),course.getCode()))
                .toList();
        this.status=status;
    }

    // Nested DTO for user details
    public static class UserDTO {
        private Long id;
        private String firstName;
        private String lastName;

        public UserDTO(Long id, String firstName, String lastName) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
    }

    @Data// Nested DTO for course details
    public static class CourseDTO {
        private Long id;
        private String name;
        private String code;

        public CourseDTO(Long id, String name,String code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }
    }
}
