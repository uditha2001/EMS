package com.example.examManagementBackend.Notification.NotificationDTO;


import com.example.examManagementBackend.Notification.NotificationEntity.NotificationsLabels;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class NotificationDTO {
    private Long id;
    private String content;
    private NotificationsLabels notificationsLabels;
}
