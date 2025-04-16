package com.example.examManagementBackend.calendar;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Convert Event entity to EventDTO
    private EventDTO convertToDTO(Event event) {
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(event.getId());
        eventDTO.setTitle(event.getTitle());
        eventDTO.setDescription(event.getDescription());
        eventDTO.setStartDate(event.getStartDate());
        eventDTO.setEndDate(event.getEndDate());
        eventDTO.setLocation(event.getLocation());
        eventDTO.setVisibility(event.getVisibility().toString()); // Visibility is enum
        eventDTO.setUserId(event.getUserId());
        return eventDTO;
    }

    public List<EventDTO> getPublicEvents() {
        List<Event> events = eventRepository.findByVisibility(Event.Visibility.PUBLIC);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getUserEvents(Long userId) {
        List<Event> events = eventRepository.findByVisibilityAndUserId(Event.Visibility.PRIVATE, userId);
        return events.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingPublicEvents() {
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findByVisibility(Event.Visibility.PUBLIC).stream()
                .filter(event -> event.getStartDate().isAfter(now) || event.getStartDate().isEqual(now))
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EventDTO> getUpcomingUserEvents(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findByVisibilityAndUserId(Event.Visibility.PRIVATE, userId).stream()
                .filter(event -> event.getStartDate().isAfter(now) || event.getStartDate().isEqual(now))
                .map(this::convertToDTO).collect(Collectors.toList());
    }

    public EventDTO createEvent(Event event) {
        Event savedEvent = eventRepository.save(event);
        return convertToDTO(savedEvent);
    }

    public EventDTO updateEvent(Long id, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setTitle(updatedEvent.getTitle());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setStartDate(updatedEvent.getStartDate());
            existingEvent.setEndDate(updatedEvent.getEndDate());
            existingEvent.setLocation(updatedEvent.getLocation());
            existingEvent.setVisibility(updatedEvent.getVisibility());
            existingEvent.setUserId(updatedEvent.getUserId());
            Event savedEvent = eventRepository.save(existingEvent);
            return convertToDTO(savedEvent);
        }
        return null;
    }

    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

