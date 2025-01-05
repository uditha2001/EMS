package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.CourseEntity;
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

    public List<CourseEntity> getAllCourses() {

        return courseRepository.findAll();
    }

    public Optional<CourseEntity> getCourseById(Long id) {

        return courseRepository.findById(id);
    }

    public CourseEntity createCourse(CourseEntity course) {

        return courseRepository.save(course);
    }

    public CourseEntity updateCourse(Long id, CourseEntity course) {

        course.setId(id);
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {

        courseRepository.deleteById(id);
    }
}
