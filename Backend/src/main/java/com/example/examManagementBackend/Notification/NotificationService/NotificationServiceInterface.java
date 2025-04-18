package com.example.examManagementBackend.Notification.NotificationService;

import com.example.examManagementBackend.Notification.NotificationDTO.NotificationDTO;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;

public interface NotificationServiceInterface {
    public ResponseEntity<StandardResponse> saveNotification(NotificationDTO notification,String userName);
}
