package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
@Entity
public class EncryptedPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String fileName;

    private String remarks;

    @Column(nullable = false)
    private String filePath;

//    @Lob
//    private byte[] encryptedData; // Store encrypted PDF data as Base64 encoded string

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator; // Reference to the creator of the paper

    @ManyToOne
    @JoinColumn(name = "moderator_id", nullable = true)
    private UserEntity moderator; // Reference to the moderator (optional initially)

    @Column(nullable = false)
    private boolean isShared = false; // Sharing status

    @CreatedDate
    @Column(columnDefinition = "DATETIME")
    private LocalDateTime sharedAt; // Timestamp when the paper was shared

    @CreatedDate
    @Column(nullable = false,columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
    @LastModifiedDate
    @Column(nullable = false,columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "encryptedPaper")
    private List<ModerationsEntity> moderations;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "encryptedPaper")
    private List<PapersCoursesEntity> papersCourses;


}
