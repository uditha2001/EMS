package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;

import java.time.LocalDateTime;

public class EncryptedPaperDTO {

    private Long id;
    private String fileName;
    private boolean isShared;
    private LocalDateTime sharedAt;
    private String courseCode;
    private String remarks;
    private UserDTO creator;
    private UserDTO moderator;

    // Constructor for converting entity to DTO
    public EncryptedPaperDTO(Long id, String fileName, boolean isShared, String courseCode, String remarks, LocalDateTime sharedAt, UserEntity creator, UserEntity moderator) {
        this.id = id;
        this.fileName = fileName;
        this.isShared = isShared;
        this.courseCode = courseCode;
        this.remarks = remarks;
        this.sharedAt = sharedAt;
        this.creator = new UserDTO(creator.getUserId(), creator.getFirstName(), creator.getLastName());
        this.moderator = new UserDTO(moderator.getUserId(), moderator.getFirstName(), moderator.getLastName());
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

    public UserDTO getCreator() {
        return creator;
    }

    public void setCreator(UserDTO creator) {
        this.creator = creator;
    }

    public UserDTO getModerator() {
        return moderator;
    }

    public void setModerator(UserDTO moderator) {
        this.moderator = moderator;
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
}
