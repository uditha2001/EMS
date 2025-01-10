package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramCourseDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramCourseEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repo.DegreeProgramCourseRepo;
import com.example.examManagementBackend.paperWorkflows.repo.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DegreeProgramCourseService {

    @Autowired
    private DegreeProgramCourseRepo courseRepo;

    @Autowired
    private DegreeProgramRepo degreeProgramRepo;


    // Create a course
    public DegreeProgramCourseEntity createCourse(DegreeProgramCourseDTO dto) {
        DegreeProgramsEntity degreeProgram = degreeProgramRepo.findById(dto.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + dto.getDegreeProgramId()));

        DegreeProgramCourseEntity course = new DegreeProgramCourseEntity();
        course.setDegreeProgram(degreeProgram);
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setCode(dto.getCode());
        course.setSemester(dto.getSemester());

        return courseRepo.save(course);
    }

    public List<DegreeProgramCourseEntity> getAllCourses(){
        return courseRepo.findAll();
    }

    // Get a course by ID
    public DegreeProgramCourseEntity getCourseById(int id) {
        DegreeProgramCourseEntity course = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        return course;
    }

    // Get all courses for a degree program
    public List<DegreeProgramCourseEntity> getAllCoursesForDegreeProgram(int degreeProgramId) {
        return courseRepo.findByDegreeProgramId(degreeProgramId)
                .stream()
                .collect(Collectors.toList());
    }

    // Update a course
    public DegreeProgramCourseEntity updateCourse(int id, DegreeProgramCourseDTO updatedCourseDTO) {
        DegreeProgramCourseEntity existingCourse = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        existingCourse.setCode(updatedCourseDTO.getCode());
        existingCourse.setName(updatedCourseDTO.getName());
        existingCourse.setDescription(updatedCourseDTO.getDescription());
        existingCourse.setSemester(updatedCourseDTO.getSemester());

        return courseRepo.save(existingCourse);
    }

    // Delete a course
    public void deleteCourse(int id) {
        DegreeProgramCourseEntity course = courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepo.delete(course);
    }

}
