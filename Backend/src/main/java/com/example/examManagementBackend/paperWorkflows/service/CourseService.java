package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.dto.CourseEvaluationsDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import com.example.examManagementBackend.paperWorkflows.repository.ExamTypesRepository;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.utill.StandardResponse;
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
    private final CourseEvaluationRepo courseEvaluationsRepository;
    private final ExamTypesRepository examTypesRepository;

    public CourseService(CoursesRepository coursesRepository, DegreeProgramRepo degreeProgramRepo,
                         CourseEvaluationRepo courseEvaluationsRepository, ExamTypesRepository examTypesRepository) {
        this.coursesRepository = coursesRepository;
        this.degreeProgramRepo = degreeProgramRepo;
        this.courseEvaluationsRepository = courseEvaluationsRepository;
        this.examTypesRepository = examTypesRepository;
    }

    /**
     * Get all courses.
     */
    public List<CourseDTO> getAllCourses() {
        return coursesRepository.findAll().stream()
                .map(this::convertCourseToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Save a new course along with its course evaluation.
     */
    public CoursesEntity saveCourse(CourseDTO dto) {
        DegreeProgramsEntity degreeProgram = degreeProgramRepo.findById(dto.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + dto.getDegreeProgramId()));

        // Create and save the Course Entity
        CoursesEntity course = createCourseEntity(dto, degreeProgram);
        CoursesEntity savedCourse = coursesRepository.save(course);

        // Create Course Evaluations (if provided)
        saveCourseEvaluations(dto.getCourseEvaluations(), savedCourse);

        return savedCourse;
    }

    /**
     * Get a single course by ID.
     */
    public CourseDTO getCourseById(Long id) {
        CoursesEntity course = coursesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        List<CourseEvaluationsDTO> courseEvaluationsDTO = course.getCourseEvaluationsEntitySet().stream()
                .map(this::convertCourseEvaluationToDTO)
                .collect(Collectors.toList());

        return convertCourseToDTO(course, courseEvaluationsDTO);
    }

    /**
     * Update an existing course.
     */
    public CoursesEntity updateCourse(Long id, CourseDTO dto) {
        CoursesEntity course = coursesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));

        DegreeProgramsEntity degreeProgram = degreeProgramRepo.findById(dto.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + dto.getDegreeProgramId()));

        // Update course details and save
        updateCourseEntity(course, dto, degreeProgram);
        CoursesEntity updatedCourse = coursesRepository.save(course);

        // Update Course Evaluations (if provided)
        updateCourseEvaluations(dto.getCourseEvaluations(), updatedCourse);

        return updatedCourse;
    }

    private void updateCourseEvaluations(List<CourseEvaluationsDTO> evaluationsDTO, CoursesEntity updatedCourse) {
        if (evaluationsDTO != null && !evaluationsDTO.isEmpty()) {
            for (CourseEvaluationsDTO evaluationDTO : evaluationsDTO) {
                // Check if the evaluation already exists
                CourseEvaluationsEntity existingEvaluation = courseEvaluationsRepository
                        .findByCoursesAndExamTypes(updatedCourse, evaluationDTO.getExamTypeId());

                if (existingEvaluation != null) {
                    // If the evaluation exists, update it
                    existingEvaluation.setPassMark(evaluationDTO.getPassMark());
                    existingEvaluation.setWeightage(evaluationDTO.getWeightage());
                    courseEvaluationsRepository.save(existingEvaluation);
                } else {
                    // If the evaluation does not exist, create a new one
                    saveNewCourseEvaluation(evaluationDTO, updatedCourse);
                }
            }
        }
    }

    private void saveNewCourseEvaluation(CourseEvaluationsDTO evaluationDTO, CoursesEntity updatedCourse) {
        ExamTypesEntity examType = examTypesRepository.findById(evaluationDTO.getExamTypeId())
                .orElseThrow(() -> new RuntimeException("Exam Type not found with ID: " + evaluationDTO.getExamTypeId()));

        CourseEvaluationsEntity newEvaluation = new CourseEvaluationsEntity();
        newEvaluation.setCourses(updatedCourse);
        newEvaluation.setExamTypes(examType);
        newEvaluation.setPassMark(evaluationDTO.getPassMark());
        newEvaluation.setWeightage(evaluationDTO.getWeightage());

        courseEvaluationsRepository.save(newEvaluation);
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

    /**
     * Get courses by degree program.
     */
    public ResponseEntity<StandardResponse> getCourseByDegreeProgram(String degreeProgram) {
        List<CoursesEntity> coursesEntity = coursesRepository.getdataByDegreeName(degreeProgram);
        if (coursesEntity != null && !coursesEntity.isEmpty()) {
            List<CourseDTO> courseDTOList = coursesEntity.stream()
                    .map(course -> convertCourseToDTO(course, null))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(new StandardResponse(200, "Success", courseDTOList), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new StandardResponse(500, "Failed", null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a course evaluation by ID.
     */
    public void deleteCourseEvaluation(Long courseEvaluationId) {
        // Find the course evaluation entity
        CourseEvaluationsEntity courseEvaluation = courseEvaluationsRepository.findById(courseEvaluationId)
                .orElseThrow(() -> new RuntimeException("Course Evaluation not found with ID: " + courseEvaluationId));

        // Delete the course evaluation
        courseEvaluationsRepository.delete(courseEvaluation);
    }


    // Helper method to convert CourseEntity to CourseDTO
    private CourseDTO convertCourseToDTO(CoursesEntity course, List<CourseEvaluationsDTO> courseEvaluationsDTO) {
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
                course.getDegreeProgramsEntity().getDegreeName(),
                courseEvaluationsDTO
        );
    }

    // Helper method to convert CourseEntity to CourseDTO (without evaluations)
    private CourseDTO convertCourseToDTO(CoursesEntity course) {
        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDescription(),
                course.getLevel(),
                course.getSemester(),
                course.getIsActive(),
                course.getCourseType().name(),
                course.getCreatedAt(),
                course.getUpdatedAt(),
                course.getDegreeProgramsEntity().getId(),
                course.getDegreeProgramsEntity().getDegreeName(),
                new ArrayList<>()
        );
    }

    // Helper method to convert CourseEvaluationEntity to CourseEvaluationsDTO
    private CourseEvaluationsDTO convertCourseEvaluationToDTO(CourseEvaluationsEntity evaluation) {
        return new CourseEvaluationsDTO(
                evaluation.getCourseEvaluationId(),
                evaluation.getExamTypes().getId(),
                evaluation.getExamTypes().getExamType(),
                evaluation.getPassMark(),
                evaluation.getWeightage()
        );
    }

    // Helper method to create and populate CourseEntity
    private CoursesEntity createCourseEntity(CourseDTO dto, DegreeProgramsEntity degreeProgram) {
        CoursesEntity course = new CoursesEntity();
        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setLevel(dto.getLevel());
        course.setSemester(dto.getSemester());
        course.setIsActive(dto.getIsActive());
        course.setCourseType(CoursesEntity.CourseType.valueOf(dto.getCourseType())); // Convert string to enum
        course.setDegreeProgramsEntity(degreeProgram);
        return course;
    }

    // Helper method to update an existing CourseEntity
    private void updateCourseEntity(CoursesEntity course, CourseDTO dto, DegreeProgramsEntity degreeProgram) {
        course.setCode(dto.getCode());
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setLevel(dto.getLevel());
        course.setSemester(dto.getSemester());
        course.setIsActive(dto.getIsActive());
        course.setCourseType(CoursesEntity.CourseType.valueOf(dto.getCourseType()));
        course.setDegreeProgramsEntity(degreeProgram);
    }

    // Helper method to save Course Evaluations
    private void saveCourseEvaluations(List<CourseEvaluationsDTO> evaluationsDTO, CoursesEntity savedCourse) {
        if (evaluationsDTO != null && !evaluationsDTO.isEmpty()) {
            for (CourseEvaluationsDTO evaluationDTO : evaluationsDTO) {
                ExamTypesEntity examType = examTypesRepository.findById(evaluationDTO.getExamTypeId())
                        .orElseThrow(() -> new RuntimeException("Exam Type not found with ID: " + evaluationDTO.getExamTypeId()));

                CourseEvaluationsEntity courseEvaluation = new CourseEvaluationsEntity();
                courseEvaluation.setCourses(savedCourse);
                courseEvaluation.setExamTypes(examType);
                courseEvaluation.setPassMark(evaluationDTO.getPassMark());
                courseEvaluation.setWeightage(evaluationDTO.getWeightage());

                courseEvaluationsRepository.save(courseEvaluation);
            }
        }
    }
}
