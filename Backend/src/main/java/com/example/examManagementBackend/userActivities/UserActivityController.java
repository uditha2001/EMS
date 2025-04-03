package com.example.examManagementBackend.userActivities;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/activity")
public class UserActivityController {

    private final UserActivityRepository repository;

    public UserActivityController(UserActivityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UserActivity> getAllActivities() {
        return repository.findAll();
    }
}

