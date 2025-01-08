package com.example.examManagementBackend.Notification.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.management.Notification;

@Service
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    public void sendNotification(Notification notification, String UserName) {
        messagingTemplate.convertAndSend("/topic/"+UserName, notification);
    }
}
