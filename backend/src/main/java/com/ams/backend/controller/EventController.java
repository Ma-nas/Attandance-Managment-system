package com.ams.backend.controller;

import com.ams.backend.entity.Event;
import com.ams.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        // Fetch events from today onwards
        List<Event> upcomingEvents = eventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDate.now().minusDays(1));
        return ResponseEntity.ok(upcomingEvents);
    }
}
