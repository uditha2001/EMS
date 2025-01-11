package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repository.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DegreeProgramService {

    @Autowired
    private DegreeProgramRepo degreeProgramRepo;

    /**
     * Get all degree programs and convert them to DTOs.
     */
    public List<DegreeProgramDTO> getAllDegreePrograms() {
        return degreeProgramRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Save a new degree program.
     */
    public DegreeProgramDTO saveDegreeProgram(DegreeProgramDTO dto) {
        DegreeProgramsEntity entity = new DegreeProgramsEntity();
        entity.setDegreeName(dto.getName());
        entity.setDegreeDescription(dto.getDescription());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(null); // Initially null for new records

        DegreeProgramsEntity savedEntity = degreeProgramRepo.save(entity);
        return convertToDTO(savedEntity);
    }

    /**
     * Get a single degree program by ID and convert it to a DTO.
     */
    public DegreeProgramDTO getOneDegreeProgram(int id) {
        DegreeProgramsEntity entity = degreeProgramRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + id));
        return convertToDTO(entity);
    }

    /**
     * Update an existing degree program.
     */
    public DegreeProgramDTO updateDegreeProgram(DegreeProgramDTO dto, int id) {
        DegreeProgramsEntity existingProgram = degreeProgramRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + id));

        existingProgram.setDegreeName(dto.getName());
        existingProgram.setDegreeDescription(dto.getDescription());
        existingProgram.setUpdatedAt(LocalDateTime.now());

        DegreeProgramsEntity updatedEntity = degreeProgramRepo.save(existingProgram);
        return convertToDTO(updatedEntity);
    }

    /**
     * Delete a degree program by ID.
     */
    public void deleteDegreeProgram(int id) {
        DegreeProgramsEntity existingProgram = degreeProgramRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with ID: " + id));

        degreeProgramRepo.delete(existingProgram);
    }

    /**
     * Convert DegreeProgramsEntity to DegreeProgramDTO.
     */
    private DegreeProgramDTO convertToDTO(DegreeProgramsEntity entity) {
        return new DegreeProgramDTO(
                entity.getId(),
                entity.getDegreeName(),
                entity.getDegreeDescription(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
