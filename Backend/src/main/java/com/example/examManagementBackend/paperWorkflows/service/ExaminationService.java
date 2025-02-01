package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.ExaminationCoursesDTO;
import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
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
public class ExaminationService {

    private ExaminationRepository examinationRepository;

    public ExaminationService(ExaminationRepository examinationRepository) {
        this.examinationRepository = examinationRepository;
    }

    @Autowired
    private DegreeProgramRepo degreeProgramsRepository;


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

        return ExaminationCoursesDTO.builder()
                .id(examination.getId())
                .degreeId(examination.getDegreeProgramsEntity().getId())
                .degreeName(examination.getDegreeProgramsEntity().getDegreeName())
                .activeCourses(
                        examination.getDegreeProgramsEntity().getCoursesEntities().stream()
                                .filter(course -> course.getLevel().equals(Integer.parseInt(examination.getLevel())) &&
                                        course.getSemester().equals(examination.getSemester()) &&
                                        course.getIsActive())
                                .map(course -> new ExaminationCoursesDTO.ActiveCourseDTO(
                                        course.getId(), course.getCode(), course.getName(), course.getCourseType()
                                ))
                                .collect(Collectors.toList())
                )
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
}
