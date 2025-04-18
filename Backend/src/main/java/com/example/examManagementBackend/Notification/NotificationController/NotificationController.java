package com.example.examManagementBackend.Notification.NotificationController;

import com.example.examManagementBackend.Notification.NotificationService.NotificationService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    @GetMapping
    public ResponseEntity<StandardResponse> getAllNotifications(HttpServletRequest request) {
        return notificationService.getNotifications(request);
    }
    @PostMapping("/readStatus")
    public ResponseEntity<StandardResponse> readStatus(@RequestBody Long notificationId) {
                return notificationService.markAsRead(notificationId);
    }
}
