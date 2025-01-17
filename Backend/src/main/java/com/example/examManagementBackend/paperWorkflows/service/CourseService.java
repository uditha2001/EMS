package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private DegreeProgramRepo degreeProgramRepo;

    /**
     * Get all courses.
     */
    public List<CourseDTO> getAllCourses() {
        return coursesRepository.findAll().stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getCode(),
                        course.getName(),
                        course.getDescription(),
                        course.getLevel(),
                        course.getSemester(),
                        course.getIsActive(),
                        course.getCreatedAt(),
                        course.getUpdatedAt(),
                        course.getDegreeProgramsEntity().getId()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Save a new course.
     */
    public CoursesEntity saveCourse(CourseDTO dto) {
        DegreeProgramsEntity degreeProgram = degreeProgramRepo.findById(dto.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + dto.getDegreeProgramId()));

        CoursesEntity course = new CoursesEntity();
        return getCoursesEntity(dto, degreeProgram, course);
    }

    private CoursesEntity getCoursesEntity(CourseDTO dto, DegreeProgramsEntity degreeProgram, CoursesEntity course) {
        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setLevel(dto.getLevel());
        course.setSemester(dto.getSemester());
        course.setIsActive(dto.getIsActive());
        course.setDegreeProgramsEntity(degreeProgram);

        return coursesRepository.save(course);
    }

    /**
     * Get a single course by ID.
     */
    public CourseDTO getCourseById(Long id) {
        CoursesEntity course = coursesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDescription(),
                course.getLevel(),
                course.getSemester(),
                course.getIsActive(),
                course.getCreatedAt(),
                course.getUpdatedAt(),
                course.getDegreeProgramsEntity().getId()
        );
    }

    /**
     * Update an existing course.
     */
    public CoursesEntity updateCourse(Long id, CourseDTO dto) {
        CoursesEntity course = coursesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        DegreeProgramsEntity degreeProgram = degreeProgramRepo.findById(dto.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + dto.getDegreeProgramId()));

        return getCoursesEntity(dto, degreeProgram, course);
    }

    /**
     * Delete a course.
     */
    public void deleteCourse(Long id) {
        CoursesEntity course = coursesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        coursesRepository.delete(course);
    }
}
