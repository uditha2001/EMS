package com.example.examManagementBackend.calendar;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/public")
    public List<EventDTO> getPublicEvents() {
        return eventService.getPublicEvents();
    }

    @GetMapping("/user/{userId}")
    public List<EventDTO> getUserEvents(@PathVariable Long userId) {
        return eventService.getUserEvents(userId);
    }

    @GetMapping("/public/upcoming")
    public List<EventDTO> getUpcomingPublicEvents() {
        return eventService.getUpcomingPublicEvents();
    }

    @GetMapping("/user/{userId}/upcoming")
    public List<EventDTO> getUpcomingUserEvents(@PathVariable Long userId) {
        return eventService.getUpcomingUserEvents(userId);
    }


    @PostMapping
    public EventDTO createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PutMapping("/{id}")
    public EventDTO updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return eventService.updateEvent(id, event);
    }

    @DeleteMapping("/{id}")
    public boolean deleteEvent(@PathVariable Long id) {
        return eventService.deleteEvent(id);
    }
}

