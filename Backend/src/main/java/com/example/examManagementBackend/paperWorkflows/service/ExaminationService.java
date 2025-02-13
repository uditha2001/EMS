package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationCoursesDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.resultManagement.repo.ExaminationTimeTableRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExaminationService {

    private final ExaminationRepository examinationRepository;
    private final ExaminationTimeTableRepository examinationTimeTableRepository;
    private final UserRolesRepository userRolesRepository;
    private final DegreeProgramRepo degreeProgramsRepository;
    private final RoleAssignmentRepository roleAssignmentRepository;

    public ExaminationService(ExaminationRepository examinationRepository, ExaminationTimeTableRepository examinationTimeTableRepository,UserRolesRepository userRolesRepository, DegreeProgramRepo degreeProgramsRepository, RoleAssignmentRepository roleAssignmentRepository) {
        this.examinationRepository = examinationRepository;
        this.examinationTimeTableRepository = examinationTimeTableRepository;
        this.userRolesRepository = userRolesRepository;
        this.degreeProgramsRepository = degreeProgramsRepository;
        this.roleAssignmentRepository = roleAssignmentRepository;
    }







    public ExaminationDTO createExamination(ExaminationDTO examinationDTO) {
        DegreeProgramsEntity degreeProgram = degreeProgramsRepository.findById(examinationDTO.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found"));

        ExaminationEntity entity = new ExaminationEntity();
        entity.setYear(examinationDTO.getYear());
        entity.setLevel(examinationDTO.getLevel());
        entity.setSemester(examinationDTO.getSemester());
        entity.setDegreeProgramsEntity(degreeProgram);
        entity.setExamProcessStartDate(examinationDTO.getExamProcessStartDate());
        entity.setPaperSettingCompleteDate(examinationDTO.getPaperSettingCompleteDate());
        entity.setMarkingCompleteDate(examinationDTO.getMarkingCompleteDate());

        ExaminationEntity savedEntity = examinationRepository.save(entity);

        return mapToDTO(savedEntity);
    }


    public ExaminationDTO getExaminationById(Long id) {
        ExaminationEntity entity = examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examination not found"));
        return mapToDTO(entity);
    }


    public List<ExaminationDTO> getAllExaminations() {
        return examinationRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }




    public ExaminationDTO updateExamination(Long id, ExaminationDTO examinationDTO) {
        ExaminationEntity entity = examinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Examination not found"));

        DegreeProgramsEntity degreeProgram = degreeProgramsRepository.findById(examinationDTO.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found"));

        entity.setYear(examinationDTO.getYear());
        entity.setLevel(examinationDTO.getLevel());
        entity.setSemester(examinationDTO.getSemester());
        entity.setDegreeProgramsEntity(degreeProgram);
        entity.setExamProcessStartDate(examinationDTO.getExamProcessStartDate());
        entity.setPaperSettingCompleteDate(examinationDTO.getPaperSettingCompleteDate());
        entity.setMarkingCompleteDate(examinationDTO.getMarkingCompleteDate());

        ExaminationEntity updatedEntity = examinationRepository.save(entity);
        updateGrantAtDates(updatedEntity);

        return mapToDTO(updatedEntity);
    }


    public void deleteExamination(Long id) {
        if (!examinationRepository.existsById(id)) {
            throw new RuntimeException("Examination not found");
        }
        examinationRepository.deleteById(id);
    }

    private ExaminationDTO mapToDTO(ExaminationEntity entity) {
        ExaminationDTO dto = new ExaminationDTO();
        dto.setId(entity.getId());
        dto.setYear(entity.getYear());
        dto.setLevel(entity.getLevel());
        dto.setSemester(entity.getSemester());
        dto.setDegreeProgramId(entity.getDegreeProgramsEntity().getId());
        dto.setDegreeProgramName(entity.getDegreeProgramsEntity().getDegreeName());
        dto.setExamProcessStartDate(entity.getExamProcessStartDate());
        dto.setPaperSettingCompleteDate(entity.getPaperSettingCompleteDate());
        dto.setMarkingCompleteDate(entity.getMarkingCompleteDate());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public ExaminationCoursesDTO getExaminationWithCoursesById(Long examinationId) {
        ExaminationEntity examination = examinationRepository.findById(examinationId)
                .orElseThrow(() -> new RuntimeException("Examination not found with id: " + examinationId));

        DegreeProgramsEntity degreeProgram = examination.getDegreeProgramsEntity();
        if (degreeProgram == null) {
            throw new RuntimeException("Degree program not found for examination id: " + examinationId);
        }

        List<ExaminationCoursesDTO.ActiveCourseDTO> activeCourses = degreeProgram.getCoursesEntities().stream()
                .filter(course -> isCourseActiveAndMatchesExamination(course, examination))
                .flatMap(course -> mapCourseToActiveCourseDTOs(course, examination).stream())
                .collect(Collectors.toList());

        return ExaminationCoursesDTO.builder()
                .id(examination.getId())
                .degreeId(degreeProgram.getId())
                .degreeName(degreeProgram.getDegreeName())
                .activeCourses(activeCourses)
                .build();
    }

    public ExaminationCoursesDTO getExaminationWithAllActiveCoursesById(Long examinationId) {
        // Retrieve the examination entity
        ExaminationEntity examination = examinationRepository.findById(examinationId)
                .orElseThrow(() -> new RuntimeException("Examination not found with id: " + examinationId));

        // Retrieve the associated degree program
        DegreeProgramsEntity degreeProgram = examination.getDegreeProgramsEntity();
        if (degreeProgram == null) {
            throw new RuntimeException("Degree program not found for examination id: " + examinationId);
        }

        // Filter active courses and map to DTO
        List<ExaminationCoursesDTO.ActiveCourseDTO> activeCourses = degreeProgram.getCoursesEntities().stream()
                .filter(course -> isCourseActiveAndMatchesExamination(course, examination))
                .map(course -> new ExaminationCoursesDTO.ActiveCourseDTO(
                        course.getId(),
                        course.getCode(),
                        course.getName(),
                        course.getCourseType()
                ))
                .collect(Collectors.toList());

        // Build the ExaminationCoursesDTO
        return ExaminationCoursesDTO.builder()
                .id(examination.getId())
                .degreeId(degreeProgram.getId())
                .degreeName(degreeProgram.getDegreeName())
                .activeCourses(activeCourses)
                .build();
    }



    public ResponseEntity<StandardResponse> getExaminationWithDegreeProgram() {
        List<String> degreeNames=new ArrayList<>();
        List<ExaminationDTO> examinationDTOS=new ArrayList<>();
        List<ExaminationEntity> examinationEntities = examinationRepository.findAll();
        for(ExaminationEntity examinationEntity : examinationEntities) {
            ExaminationDTO examinationDTO=mapToDTO(examinationEntity);
            examinationDTOS.add(examinationDTO);
        }

       return new ResponseEntity<>(
               new StandardResponse(200,"sucess",examinationDTOS), HttpStatus.OK
       );
    }

    //create a methode to get coursedata which ara belongs to particular exam
    public ResponseEntity<StandardResponse> getCoursesByExaminationId(Long examinationId) {
        try{
            Set<CourseDTO> courseDTOS=new HashSet<>();
            List<ExamTimeTablesEntity> examTimeTablesEntities=examinationRepository.getCoursesUsingExaminationId(examinationId);
            for(ExamTimeTablesEntity examinationEntity:examTimeTablesEntities){
                CourseDTO courseDTO=new CourseDTO();
                CoursesEntity coursesEntity=examinationTimeTableRepository.getCourseEntities(examinationEntity.getExamTimeTableId());
                courseDTO.setId(coursesEntity.getId());
                courseDTO.setCode(coursesEntity.getCode());
                courseDTO.setName(coursesEntity.getName());
                courseDTO.setDescription(coursesEntity.getDescription());
                courseDTO.setLevel(coursesEntity.getLevel());
                courseDTO.setSemester(coursesEntity.getSemester());
                courseDTO.setIsActive(coursesEntity.getIsActive());
                courseDTO.setCourseType(coursesEntity.getCourseType().name());
                courseDTO.setDegreeProgramId(coursesEntity.getDegreeProgramsEntity().getId());
                courseDTOS.add(courseDTO);
            }
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(200,"sucess",courseDTOS), HttpStatus.OK
            );
        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                   new StandardResponse(500,"erroe",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    private boolean isCourseActiveAndMatchesExamination(CoursesEntity course, ExaminationEntity examination) {
        return course.getLevel().equals(Integer.parseInt(examination.getLevel())) &&
                course.getSemester().equals(examination.getSemester()) &&
                course.getIsActive();
    }

    private List<ExaminationCoursesDTO.ActiveCourseDTO> mapCourseToActiveCourseDTOs(CoursesEntity course, ExaminationEntity examination) {
        boolean isTheoryAssigned = roleAssignmentRepository.existsByCourseIdAndExaminationIdAndPaperType(
                course.getId(), examination, PaperType.THEORY
        );
        boolean isPracticalAssigned = roleAssignmentRepository.existsByCourseIdAndExaminationIdAndPaperType(
                course.getId(), examination, PaperType.PRACTICAL
        );

        // If the course type is BOTH, handle separately
        if ("BOTH".equalsIgnoreCase(course.getCourseType().toString())) {
            return handleBothCourseType(course, examination);
        } else if (course.getCourseType() == CoursesEntity.CourseType.THEORY && isTheoryAssigned) {
            // If it's a THEORY course and already assigned, don't display it
            return Collections.emptyList();
        } else if (course.getCourseType() == CoursesEntity.CourseType.PRACTICAL && isPracticalAssigned) {
            // If it's a PRACTICAL course and already assigned, don't display it
            return Collections.emptyList();
        } else {
            // Otherwise, include the course
            return Collections.singletonList(new ExaminationCoursesDTO.ActiveCourseDTO(
                    course.getId(), course.getCode(), course.getName(), course.getCourseType()
            ));
        }
    }


    private List<ExaminationCoursesDTO.ActiveCourseDTO> handleBothCourseType(CoursesEntity course, ExaminationEntity examination) {
        boolean hasTheoryAssigned = roleAssignmentRepository.existsByCourseIdAndExaminationIdAndPaperType(
                course.getId(), examination, PaperType.THEORY
        );
        boolean hasPracticalAssigned = roleAssignmentRepository.existsByCourseIdAndExaminationIdAndPaperType(
                course.getId(), examination, PaperType.PRACTICAL
        );

        if (hasTheoryAssigned && hasPracticalAssigned) {
            // Exclude the course entirely if both THEORY and PRACTICAL are assigned
            return Collections.emptyList();
        } else if (hasTheoryAssigned) {
            // Only include PRACTICAL if THEORY is already assigned
            return Collections.singletonList(new ExaminationCoursesDTO.ActiveCourseDTO(
                    course.getId(), course.getCode(), course.getName(), CoursesEntity.CourseType.PRACTICAL
            ));
        } else if (hasPracticalAssigned) {
            // Only include THEORY if PRACTICAL is already assigned
            return Collections.singletonList(new ExaminationCoursesDTO.ActiveCourseDTO(
                    course.getId(), course.getCode(), course.getName(), CoursesEntity.CourseType.THEORY
            ));
        } else {
            // Include both THEORY and PRACTICAL if neither is assigned
            return Arrays.asList(
                    new ExaminationCoursesDTO.ActiveCourseDTO(
                            course.getId(), course.getCode(), course.getName(), CoursesEntity.CourseType.THEORY
                    ),
                    new ExaminationCoursesDTO.ActiveCourseDTO(
                            course.getId(), course.getCode(), course.getName(), CoursesEntity.CourseType.PRACTICAL
                    )
            );
        }
    }


    @Transactional
    public void updateExamStatus(Long examId) {
        ExaminationEntity exam = examinationRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found"));

        if (exam.getMarkingCompleteDate() != null) {
            exam.setStatus(ExamStatus.COMPLETED);
        } else if (exam.getPaperSettingCompleteDate() != null) {
            exam.setStatus(ExamStatus.ONGOING);
        } else if (exam.getExamProcessStartDate() != null) {
            exam.setStatus(ExamStatus.SCHEDULED);
        }

        examinationRepository.save(exam);
    }

    public void updateGrantAtDates(ExaminationEntity examination) {
        for (RoleAssignmentEntity roleAssignment : examination.getRoleAssignments()) {
            UserRoles userRole = roleAssignment.getUserId().getUserRoles().stream()
                    .filter(role -> role.getRole().equals(roleAssignment.getRole()))
                    .findFirst()
                    .orElse(null);

            if (userRole != null) {
                // Set the grantAt date based on the role type
                if (roleAssignment.getRole().getRoleId() == 2 || roleAssignment.getRole().getRoleId() == 3) { // Paper Creator or Paper Moderator
                    if (examination.getPaperSettingCompleteDate() != null) {
                        userRole.setGrantAt(examination.getPaperSettingCompleteDate());
                    }
                } else if (roleAssignment.getRole().getRoleId() == 4 || roleAssignment.getRole().getRoleId() == 5) { // First Marker or Second Marker
                    if (examination.getMarkingCompleteDate() != null) {
                        userRole.setGrantAt(examination.getMarkingCompleteDate());
                    }
                }

                // Save the updated user role with the new grantAt date
                userRolesRepository.save(userRole);
            }
        }
    }
}
