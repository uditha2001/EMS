package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {


    private final CoursesRepository coursesRepository;

    private final DegreeProgramRepo degreeProgramRepo;

    public CourseService(CoursesRepository coursesRepository, DegreeProgramRepo degreeProgramRepo) {
        this.coursesRepository = coursesRepository;
        this.degreeProgramRepo = degreeProgramRepo;
    }

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
                        course.getCourseType().name(), // Convert enum to string
                        course.getCreatedAt(),
                        course.getUpdatedAt(),
                        course.getDegreeProgramsEntity().getId(),
                        course.getDegreeProgramsEntity().getDegreeName()
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
        course.setCourseType(CoursesEntity.CourseType.valueOf(dto.getCourseType())); // Convert string to enum
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
                course.getCourseType().name(), // Convert enum to string
                course.getCreatedAt(),
                course.getUpdatedAt(),
                course.getDegreeProgramsEntity().getId(),
                course.getDegreeProgramsEntity().getDegreeName()

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
        if (!coursesRepository.existsById(id)) {
            throw new RuntimeException("Course not found with ID: " + id);
        }
        coursesRepository.deleteById(id);
    }

    public ResponseEntity<StandardResponse> getCourseByDegreeProgram(String degreeProgram) {
        List<CoursesEntity> coursesEntity=coursesRepository.getdataByDegreeName(degreeProgram);
        if(coursesEntity!=null) {
            List<CourseDTO> courseDTO=new ArrayList<CourseDTO>();
            for(CoursesEntity coursesEntity1 : coursesEntity){
                CourseDTO courseDTO1=new CourseDTO( );
                courseDTO1.setId(coursesEntity1.getId());
                courseDTO1.setCode(coursesEntity1.getCode());
                courseDTO1.setName(coursesEntity1.getName());
                courseDTO1.setDescription(coursesEntity1.getDescription());
                courseDTO1.setLevel(coursesEntity1.getLevel());
                courseDTO1.setSemester(coursesEntity1.getSemester());
                courseDTO1.setIsActive(coursesEntity1.getIsActive());
                courseDTO1.setCourseType(coursesEntity1.getCourseType().name());
                courseDTO1.setCreatedAt(coursesEntity1.getCreatedAt());
                courseDTO1.setUpdatedAt(coursesEntity1.getUpdatedAt());
                courseDTO.add(courseDTO1);
            }

            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(200,"sucess",courseDTO), HttpStatus.OK
            );
        }
        else{
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"failed",null),HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
