package com.example.examManagementBackend.userManagement.userManagementEntity;


import com.example.examManagementBackend.paperWorkflows.entity.ExamPaperEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ModerationsEntity;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @Column(nullable = false,unique = true)
    private String username;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false,unique = true)
    private String email;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false,columnDefinition = "INT DEFAULT 0")
    private int failedLoginAttemps;
    @Column(nullable = false,columnDefinition = "BOOLEAN DEFAULT 1")
    private boolean isActive;
    @CreatedDate
    @Column(updatable = false,nullable = false,columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @OneToMany(mappedBy = "user")
    Set<UserRoles> userRoles;

    // New columns
    @Column(nullable = true)
    private String contactNo;  // Contact number

    @Column(nullable = true, length = 500)
    private String bio;  // Bio

    @Column(nullable = true)
    private String profileImage;  // Profile image (URL or file path)
    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    private TokenEntity token;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    private ForgotPasswordEntity forgotPassword;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean isSeeded = true; // Flag to indicate seeded users

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<ExamPaperEntity> examPapers;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "moderator")
    private List<ModerationsEntity> moderationsEntities;

    public UserEntity() {

    }

    public UserEntity(String username, String email, String firstName, String lastName, int failedLoginAttemps, boolean isActive) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.failedLoginAttemps = failedLoginAttemps;
        this.isActive = isActive;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public int getFailedLoginAttemps() {
        return failedLoginAttemps;
    }

    public void setFailedLoginAttemps(int failedLoginAttemps) {
        this.failedLoginAttemps = failedLoginAttemps;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }




    public Long getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Set<UserRoles> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<UserRoles> userRoles) {
        this.userRoles = userRoles;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }


}
