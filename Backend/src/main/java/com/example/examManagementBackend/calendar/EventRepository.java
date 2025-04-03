package com.example.examManagementBackend.calendar;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVisibilityAndUserId(Event.Visibility visibility, Long userId);

    List<Event> findByVisibility(Event.Visibility visibility); // For public events
}

