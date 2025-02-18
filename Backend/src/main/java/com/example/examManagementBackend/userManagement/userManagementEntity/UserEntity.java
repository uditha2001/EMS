package com.example.examManagementBackend.userManagement.userManagementEntity;


import com.example.examManagementBackend.resultManagement.entities.ExamInvigilatorsEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.ExamPaperEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
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

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "userId")
    private List<RoleAssignmentEntity> roleAssignments;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    private List<EncryptedPaper> createdPapers; // Papers created by the user

    @OneToMany(mappedBy = "moderator", cascade = CascadeType.ALL)
    private List<EncryptedPaper> moderatedPapers; // Papers moderated by the user

//    @Column(columnDefinition = "LONGTEXT")
//    private String publicKey;

    @Column(name = "public_key",columnDefinition = "LONGTEXT")
    private String publicKey;

    @Column(name = "private_key",columnDefinition = "LONGTEXT")
    private String privateKey;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "supervisor")
    private Set<ExamTimeTablesEntity> examTimeTables;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "approvedBy")
    private Set<ResultEntity> resultEntitySet;

    @OneToMany(cascade = CascadeType.ALL,mappedBy = "invigilators")
    private Set<ExamInvigilatorsEntity> invigilators;

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

    public List<EncryptedPaper> getCreatedPapers() {
        return createdPapers;
    }

    public void setCreatedPapers(List<EncryptedPaper> createdPapers) {
        this.createdPapers = createdPapers;
    }

    public List<EncryptedPaper> getModeratedPapers() {
        return moderatedPapers;
    }

    public void setModeratedPapers(List<EncryptedPaper> moderatedPapers) {
        this.moderatedPapers = moderatedPapers;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", publicKey='" + publicKey + '\'' +
                ", privateKey='" + privateKey + '\'' +
                '}';
    }


}
