package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.AcademicYearDTO;
import com.example.examManagementBackend.paperWorkflows.entity.AcademicYearsEntity;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.AcademicYearsRepository;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicYearService {

    @Autowired
    private AcademicYearsRepository academicYearsRepository;

    @Autowired
    private DegreeProgramRepo degreeProgramsRepository;


    public AcademicYearDTO createAcademicYear(AcademicYearDTO academicYearsDTO) {
        DegreeProgramsEntity degreeProgram = degreeProgramsRepository.findById(academicYearsDTO.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found"));

        AcademicYearsEntity entity = new AcademicYearsEntity();
        entity.setYear(academicYearsDTO.getYear());
        entity.setLevel(academicYearsDTO.getLevel());
        entity.setSemester(academicYearsDTO.getSemester());
        entity.setDegreeProgramsEntity(degreeProgram);

        AcademicYearsEntity savedEntity = academicYearsRepository.save(entity);

        return mapToDTO(savedEntity);
    }


    public AcademicYearDTO getAcademicYearById(Long id) {
        AcademicYearsEntity entity = academicYearsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic Year not found"));
        return mapToDTO(entity);
    }


    public List<AcademicYearDTO> getAllAcademicYears() {
        return academicYearsRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    public AcademicYearDTO updateAcademicYear(Long id, AcademicYearDTO academicYearsDTO) {
        AcademicYearsEntity entity = academicYearsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic Year not found"));

        DegreeProgramsEntity degreeProgram = degreeProgramsRepository.findById(academicYearsDTO.getDegreeProgramId())
                .orElseThrow(() -> new RuntimeException("Degree Program not found"));

        entity.setYear(academicYearsDTO.getYear());
        entity.setLevel(academicYearsDTO.getLevel());
        entity.setSemester(academicYearsDTO.getSemester());
        entity.setDegreeProgramsEntity(degreeProgram);

        AcademicYearsEntity updatedEntity = academicYearsRepository.save(entity);

        return mapToDTO(updatedEntity);
    }


    public void deleteAcademicYear(Long id) {
        if (!academicYearsRepository.existsById(id)) {
            throw new RuntimeException("Academic Year not found");
        }
        academicYearsRepository.deleteById(id);
    }

    private AcademicYearDTO mapToDTO(AcademicYearsEntity entity) {
        AcademicYearDTO dto = new AcademicYearDTO();
        dto.setId(entity.getId());
        dto.setYear(entity.getYear());
        dto.setLevel(entity.getLevel());
        dto.setSemester(entity.getSemester());
        dto.setDegreeProgramId(entity.getDegreeProgramsEntity().getId());
        return dto;
    }
}
