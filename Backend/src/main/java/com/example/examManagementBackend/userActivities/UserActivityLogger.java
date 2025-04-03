package com.example.examManagementBackend.userActivities;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.aspectj.lang.annotation.AfterReturning;

import java.time.LocalDateTime;

@Aspect
@Component
public class UserActivityLogger {

    private final UserActivityRepository repository;

    public UserActivityLogger(UserActivityRepository repository) {
        this.repository = repository;
    }

    @AfterReturning("execution(* com.example.examManagementBackend.*.controllers.*.*(..))")
    public void logActivity(JoinPoint joinPoint) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        UserActivity activity = new UserActivity();
        activity.setUsername(username);
        activity.setAction(className + "." + methodName);
        activity.setDetails("User executed " + methodName);
        activity.setTimestamp(LocalDateTime.now());

        repository.save(activity);
    }
}
