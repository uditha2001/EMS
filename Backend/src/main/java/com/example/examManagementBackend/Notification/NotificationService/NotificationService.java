package com.example.examManagementBackend.Notification.NotificationService;
import com.example.examManagementBackend.Notification.NotificationDTO.NotificationDTO;
import com.example.examManagementBackend.Notification.NotificationEntity.NotificationEntity;
import com.example.examManagementBackend.Notification.NotificationRepo.NotificationRepo;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces.JwtService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService implements NotificationServiceInterface{
    private final UserManagementRepo userManagementRepo;
    private final NotificationRepo notificationRepo;
    private final JwtService jwtService;


    public NotificationService(UserManagementRepo userManagementRepo, NotificationRepo notificationRepo, JwtService jwtService) {
        this.userManagementRepo = userManagementRepo;
        this.notificationRepo = notificationRepo;
        this.jwtService = jwtService;
    }

    @Override
    public ResponseEntity<StandardResponse> saveNotification(NotificationDTO notification,String userName) {
        try{
            UserEntity user=userManagementRepo.findByUsername(userName);
            if(notification!=null && user!=null){
                NotificationEntity notificationEntity = new NotificationEntity();
                notificationEntity.setContent(notification.getContent());
                notificationEntity.setStatus(notification.getNotificationsLabels());
                notificationEntity.setUser(user);
                notificationRepo.save(notificationEntity);
                return new ResponseEntity<>(
                        new StandardResponse(200,"notification saved sucess",null),HttpStatus.OK
                );
            }
            return new ResponseEntity<>(
                    new StandardResponse(400,"detailes can't be null",null),HttpStatus.BAD_REQUEST
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"failed to save notifcation",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> getNotifications(HttpServletRequest request) {
        try{
            Object[] userDetails=jwtService.getUserNameAndToken(request);
            String userName=(String)userDetails[0];
            List<NotificationEntity> notificationEntities=notificationRepo.findAllByUsernameAndIsRead(userName,false);
            List<NotificationDTO> notificationDTOS=new ArrayList<>();
            if(notificationEntities.size()>0){
                for(NotificationEntity notificationEntity:notificationEntities){
                    NotificationDTO notificationDTO=new NotificationDTO();
                    notificationDTO.setContent(notificationEntity.getContent());
                    notificationDTO.setNotificationsLabels(notificationEntity.getStatus());
                    notificationDTO.setId(notificationEntity.getNotificationId());
                    notificationDTO.setRead(notificationEntity.isRead());
                    notificationDTO.setCreatedAt(notificationEntity.getCreatedAt());
                    notificationDTOS.add(notificationDTO);
                }
                return new ResponseEntity<>(
                        new StandardResponse(200,"sucessfully extract notifications",notificationDTOS),HttpStatus.OK
                );
            }
            return new ResponseEntity<>(
                    new StandardResponse(400,"detailes can't be null",null),HttpStatus.BAD_REQUEST
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"failed to get notifications",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

    }

    public ResponseEntity<StandardResponse> markAsRead(Long notificationId) {
        try{
            notificationRepo.updateReadStatusById(notificationId,true);
            return ResponseEntity.ok(new StandardResponse(200,"notification updated successfully",null));

        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"failed to mark notification",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanUpNotifications() {
        // Delete read notifications older than 2 weeks
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
        notificationRepo.deleteReadNotificationsOlderThanTwoWeeks(twoWeeksAgo);

        // Delete unread notifications older than 3 months
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        notificationRepo.deleteUnreadNotificationsOlderThanThreeMonths(threeMonthsAgo);
    }


}
