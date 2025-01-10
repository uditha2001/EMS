package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.AcademicYearDTO;
import com.example.examManagementBackend.paperWorkflows.entity.AcademicYearsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.AcademicYearsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AcademicYearsService {
    @Autowired
    private AcademicYearsRepository academicYearsRepository;

    // Convert Entity to DTO
    private AcademicYearDTO convertToDTO(AcademicYearsEntity entity) {
        AcademicYearDTO dto = new AcademicYearDTO();
        dto.setId(entity.getId());
        dto.setYear(entity.getYear());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // Convert DTO to Entity
    private AcademicYearsEntity convertToEntity(AcademicYearDTO dto) {
        AcademicYearsEntity entity = new AcademicYearsEntity();
        entity.setId(dto.getId());
        entity.setYear(dto.getYear());
        return entity;
    }

    public List<AcademicYearDTO> getAllAcademicYears() {
        return academicYearsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<AcademicYearDTO> getAcademicYearById(Long id) {
        return academicYearsRepository.findById(id).map(this::convertToDTO);
    }

    public AcademicYearDTO createAcademicYear(AcademicYearDTO academicYearDTO) {
        AcademicYearsEntity entity = convertToEntity(academicYearDTO);
        return convertToDTO(academicYearsRepository.save(entity));
    }

    public AcademicYearDTO updateAcademicYear(Long id, AcademicYearDTO academicYearDTO) {
        AcademicYearsEntity entity = convertToEntity(academicYearDTO);
        entity.setId(id);
        return convertToDTO(academicYearsRepository.save(entity));
    }

    public void deleteAcademicYear(Long id) {
        academicYearsRepository.deleteById(id);
    }
}
