package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.timetable.dto.ExamCentersDTO;
import com.example.examManagementBackend.timetable.entities.ExamCentersEntity;
import com.example.examManagementBackend.timetable.repository.ExamCentersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamCenterService {

    private final ExamCentersRepository examCentersRepository;

    public ExamCenterService(ExamCentersRepository examCentersRepository) {
        this.examCentersRepository = examCentersRepository;
    }

    // Get all exam centers
    public List<ExamCentersDTO> getAllExamCenters() {
        return examCentersRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get an exam center by id
    public Optional<ExamCentersDTO> getExamCenterById(Long id) {
        return examCentersRepository.findById(id)
                .map(this::convertToDTO);
    }

    // Create a new exam center
    public ExamCentersDTO createExamCenter(ExamCentersDTO examCentersDTO) {
        ExamCentersEntity entity = new ExamCentersEntity();
        // Mapping DTO to Entity
        entity.setExamCenterName(examCentersDTO.getName());
        entity.setExamCenterLocation(examCentersDTO.getLocation());
        entity.setExamCenterCapacity(examCentersDTO.getCapacity());
        entity.setContactPerson(examCentersDTO.getContactPerson());

        // Save and return the created entity as DTO
        ExamCentersEntity savedEntity = examCentersRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    // Update an existing exam center
    public Optional<ExamCentersDTO> updateExamCenter(Long id, ExamCentersDTO examCentersDTO) {
        Optional<ExamCentersEntity> existingEntity = examCentersRepository.findById(id);
        if (existingEntity.isPresent()) {
            ExamCentersEntity entity = existingEntity.get();
            // Mapping DTO to Entity
            entity.setExamCenterName(examCentersDTO.getName());
            entity.setExamCenterLocation(examCentersDTO.getLocation());
            entity.setExamCenterCapacity(examCentersDTO.getCapacity());
            entity.setContactPerson(examCentersDTO.getContactPerson());

            // Save and return the updated entity as DTO
            ExamCentersEntity updatedEntity = examCentersRepository.save(entity);
            return Optional.of(convertToDTO(updatedEntity));
        }
        return Optional.empty();
    }

    // Delete an exam center
    public Optional<Void> deleteExamCenter(Long id) {
        Optional<ExamCentersEntity> entity = examCentersRepository.findById(id);
        if (entity.isPresent()) {
            examCentersRepository.delete(entity.get());
            return Optional.of(null); // Successfully deleted
        }
        return Optional.empty(); // Entity not found
    }

    // Convert entity to DTO
    private ExamCentersDTO convertToDTO(ExamCentersEntity examCentersEntity) {
        ExamCentersDTO dto = new ExamCentersDTO();
        dto.setId(examCentersEntity.getId());
        dto.setName(examCentersEntity.getExamCenterName());
        dto.setLocation(examCentersEntity.getExamCenterLocation());
        dto.setCapacity(examCentersEntity.getExamCenterCapacity());
        dto.setContactPerson(examCentersEntity.getContactPerson());
        dto.setCreatedAt(examCentersEntity.getCreatedAt());
        dto.setUpdatedAt(examCentersEntity.getUpdatedAt());
        return dto;
    }
}
