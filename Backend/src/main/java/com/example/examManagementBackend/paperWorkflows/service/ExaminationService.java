package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CourseDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationCoursesDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import com.example.examManagementBackend.resultManagement.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.resultManagement.repo.ExaminationTimeTableRepository;
import com.example.examManagementBackend.utill.StandardResponse;
import org.modelmapper.ModelMapper;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final ModelMapper modelMapper;
    public ExaminationService(ExaminationRepository examinationRepository, ExaminationTimeTableRepository examinationTimeTableRepository, ModelMapper modelMapper) {
        this.examinationRepository = examinationRepository;
        this.examinationTimeTableRepository = examinationTimeTableRepository;
        this.modelMapper = modelMapper;
    }

    @Autowired
    private DegreeProgramRepo degreeProgramsRepository;

    @Autowired
    private RoleAssignmentRepository roleAssignmentRepository;


    public ExaminationDTO createExamination(ExaminationDTO examinationDTO) {
        DegreeProgramsEntity degreeProgram = degreeProgramsRepository.findById(examinationDTO.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found"));

        ExaminationEntity entity = new ExaminationEntity();
        entity.setYear(examinationDTO.getYear());
        entity.setLevel(examinationDTO.getLevel());
        entity.setSemester(examinationDTO.getSemester());
        entity.setDegreeProgramsEntity(degreeProgram);

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

        ExaminationEntity updatedEntity = examinationRepository.save(entity);

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

    public ResponseEntity<StandardResponse> getExaminationWithDegreeProgram() {
        List<String> degreeNames=new ArrayList<>();
        List<ExaminationDTO> examinationDTOS=new ArrayList<>();
        List<ExaminationEntity> examinationEntities = examinationRepository.findAll();
        for(ExaminationEntity examinationEntity : examinationEntities) {
            ExaminationDTO examinationDTO=new ExaminationDTO();
            examinationDTO.setId(examinationEntity.getId());
            examinationDTO.setYear(examinationEntity.getYear());
            examinationDTO.setLevel(examinationEntity.getLevel());
            examinationDTO.setSemester(examinationEntity.getSemester());
            examinationDTO.setDegreeProgramId(examinationEntity.getDegreeProgramsEntity().getId());
            examinationDTO.setDegreeProgramName(examinationEntity.getDegreeProgramsEntity().getDegreeName());
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
                modelMapper.map(coursesEntity,courseDTO);
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
        if ("BOTH".equalsIgnoreCase(course.getCourseType().toString())) {
            return handleBothCourseType(course, examination);
        } else {
            // For non-BOTH course types, include the course as is
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


}
