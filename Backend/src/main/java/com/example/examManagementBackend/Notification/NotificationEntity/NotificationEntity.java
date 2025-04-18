package com.example.examManagementBackend.Notification.NotificationEntity;


import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name = "notification")
@RequiredArgsConstructor
@Data
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne(cascade=CascadeType.ALL)
    @JoinColumn(name="user",referencedColumnName = "userId")
    private UserEntity user;
    private String content;
    @Column(name = "is_read")
    private boolean isRead = false;
    @Enumerated(EnumType.STRING)
    private NotificationsLabels status;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;

}
