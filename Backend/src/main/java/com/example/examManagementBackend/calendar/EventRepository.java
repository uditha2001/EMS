package com.example.examManagementBackend.calendar;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVisibilityAndUserId(Event.Visibility visibility, Long userId);

    List<Event> findByVisibility(Event.Visibility visibility); // For public events

    void deleteByTitleContainingAndUserId(String titlePart, Long userId);

    // Find a single event by user ID and title prefix
    Optional<Event> findByUserIdAndTitleStartingWith(Long userId, String titlePrefix);

    // Find all events by user ID and title prefix
    List<Event> findAllByUserIdAndTitleStartingWith(Long userId, String titlePrefix);


    // Find events by title containing and user ID
    List<Event> findByTitleContainingAndUserId(String titlePart, Long userId);
    void deleteByUserIdAndTitleAndStartDate(Long userId, String title, LocalDateTime startDate);

}

