package com.example.examManagementBackend.Notification.NotificationDTO;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class NotificationDTO {
    private NotificationStatus status;
    private String message;
    private String title;
}
