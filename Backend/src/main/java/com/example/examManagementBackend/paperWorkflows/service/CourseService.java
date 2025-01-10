package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Moderation;
import com.example.examManagementBackend.paperWorkflows.repo.CourseRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepo courseRepository;

    public List<Moderation> getAllCourses() {

        return courseRepository.findAll();
    }

    public Optional<Moderation> getCourseById(Long id) {

        return courseRepository.findById(id);
    }

    public CoursesEntity createCourse(CoursesEntity course) {

        return courseRepository.save(course);
    }

    public CoursesEntity updateCourse(Long id, CoursesEntity course) {

        course.setId(id);
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {

        courseRepository.deleteById(id);
    }
}
