package com.example.examManagementBackend.Notification.NotificationRepo;

import com.example.examManagementBackend.Notification.NotificationEntity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@EnableJpaRepositories
public interface NotificationRepo extends JpaRepository<NotificationEntity,Long> {
    @Query("SELECT n FROM NotificationEntity n WHERE n.user.username=:name AND n.isRead=:check ORDER BY n.createdAt DESC ")
    List<NotificationEntity> findAllByUsernameAndIsRead(@Param("name") String username,@Param("check") boolean check);
    @Modifying
    @Transactional
    @Query("UPDATE NotificationEntity n SET n.isRead=:check WHERE n.notificationId=:id")
    void updateReadStatusById(@Param("id") Long notificationId,@Param("check") Boolean check);
    @Modifying
    @Transactional
    @Query("DELETE FROM NotificationEntity n WHERE n.isRead = true AND n.createdAt < :twoWeeksAgo")
    void deleteReadNotificationsOlderThanTwoWeeks(@Param("twoWeeksAgo") LocalDateTime twoWeeksAgo);

    @Modifying
    @Transactional
    @Query("DELETE FROM NotificationEntity n WHERE n.isRead = false AND n.createdAt < :threeMonthsAgo")
    void deleteUnreadNotificationsOlderThanThreeMonths(@Param("threeMonthsAgo") LocalDateTime threeMonthsAgo);
}
