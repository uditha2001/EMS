package com.example.examManagementBackend.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVisibilityAndUserId(Event.Visibility visibility, Long userId);

    List<Event> findByVisibility(Event.Visibility visibility); // For public events

    void deleteByTitleContainingAndUserId(String titlePart, Long userId);

    @Query("SELECT e FROM Event e WHERE e.visibility = 'public' AND e.startDate >= :now")
    List<Event> findUpcomingPublicEvents(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM Event e WHERE e.userId = :userId AND e.startDate >= :now")
    List<Event> findUpcomingUserEvents(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    void deleteByUserIdAndTitleAndStartDate(Long userId, String title, LocalDateTime startDate);

}

