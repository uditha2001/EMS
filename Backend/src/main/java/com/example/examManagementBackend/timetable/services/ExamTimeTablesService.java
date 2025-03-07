package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExamTypesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.timetable.dto.*;
import com.example.examManagementBackend.timetable.entities.ExamCentersEntity;
import com.example.examManagementBackend.timetable.entities.ExamInvigilatorsEntity;
import com.example.examManagementBackend.timetable.entities.ExamTimeTableCenter;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.timetable.repository.ExamCentersRepository;
import com.example.examManagementBackend.timetable.repository.ExamInvigilatorsRepository;
import com.example.examManagementBackend.timetable.repository.ExamTimeTableCenterRepository;
import com.example.examManagementBackend.timetable.repository.ExaminationTimeTableRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamTimeTablesService {

    private final ExaminationTimeTableRepository examTimeTableRepository;
    private final ExamInvigilatorsRepository examInvigilatorsRepository;
    private final ExamCentersRepository examCentersRepository;
    private final UserManagementRepo userRepository;
    private final ExaminationRepository examinationRepository;
    private final CoursesRepository coursesRepository;
    private final ExamTypesRepository examTypesRepository;
    private final ExamTimeTableCenterRepository examTimeTableCenterRepository;




    public ExamTimeTablesService(ExaminationTimeTableRepository examTimeTableRepository,
                                 ExamInvigilatorsRepository examInvigilatorsRepository,
                                 ExamCentersRepository examCentersRepository,
                                 UserManagementRepo userRepository, ExaminationRepository examinationRepository, CoursesRepository coursesRepository, ExamTypesRepository examTypesRepository, ExamTimeTableCenterRepository examTimeTableCenterRepository) {
        this.examTimeTableRepository = examTimeTableRepository;
        this.examInvigilatorsRepository = examInvigilatorsRepository;
        this.examCentersRepository = examCentersRepository;
        this.userRepository = userRepository;
        this.examinationRepository = examinationRepository;
        this.coursesRepository = coursesRepository;
        this.examTypesRepository = examTypesRepository;
        this.examTimeTableCenterRepository = examTimeTableCenterRepository;
    }

    public List<ExamTimeTableDTO> saveOrUpdateExamTimeTable(List<ExamTimeTableDTO> examTimeTableDTOList) {
        List<ExamTimeTablesEntity> examTimeTables = new ArrayList<>();

        for (ExamTimeTableDTO examTimeTableDTO : examTimeTableDTOList) {
            ExamTimeTablesEntity examTimeTable;

            if (examTimeTableDTO.getExamTimeTableId() != null && examTimeTableDTO.getExamTimeTableId() > 0) {
                // Update existing record
                examTimeTable = examTimeTableRepository.findById(examTimeTableDTO.getExamTimeTableId())
                        .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));
            } else {
                // Create new record
                examTimeTable = new ExamTimeTablesEntity();

                // Fetch related entities from DB
                ExaminationEntity examination = examinationRepository.findById(examTimeTableDTO.getExaminationId())
                        .orElseThrow(() -> new RuntimeException("Examination not found"));
                CoursesEntity course = coursesRepository.findById(examTimeTableDTO.getCourseId())
                        .orElseThrow(() -> new RuntimeException("Course not found"));
                ExamTypesEntity examType = examTypesRepository.findById(examTimeTableDTO.getExamTypeId())
                        .orElseThrow(() -> new RuntimeException("Exam Type not found"));

                examTimeTable.setExamination(examination);
                examTimeTable.setCourse(course);
                examTimeTable.setExamType(examType);
            }

            // Set common fields for both create and update
            examTimeTable.setDate(examTimeTableDTO.getDate());
            examTimeTable.setStartTime(examTimeTableDTO.getStartTime());
            examTimeTable.setEndTime(examTimeTableDTO.getEndTime());
            examTimeTable.setTimetableGroup(examTimeTableDTO.getTimetableGroup());

            // Save the entity
            examTimeTable = examTimeTableRepository.save(examTimeTable);
            examTimeTables.add(examTimeTable);
        }

        // Convert saved entities to DTOs
        return examTimeTables.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    public void deleteExamTimeTable(Long examTimeTableId) {
        examTimeTableRepository.deleteById(examTimeTableId);
    }

    public List<ExamTimeTableDTO> getAllExamTimeTables() {
        return examTimeTableRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ExamTimeTableDTO> getExamTimeTablesByExamination(Long examinationId) {
        return examTimeTableRepository.findByExaminationId(examinationId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public String saveOrUpdateExamCenters(AllocateExamCentersDTO dto) {
        for (ExamCenterAllocationDTO allocation : dto.getAllocations()) {
            ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(allocation.getExamTimeTableId())
                    .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

            ExamCentersEntity examCenter = examCentersRepository.findById(allocation.getExamCenterId())
                    .orElseThrow(() -> new RuntimeException("Exam Center not found"));

            ExamTimeTableCenter existingEntry = examTimeTableCenterRepository
                    .findByExamTimeTableExamTimeTableIdAndExamCenterId(allocation.getExamTimeTableId(), allocation.getExamCenterId())
                    .orElse(null);

            if (existingEntry == null) {
                ExamTimeTableCenter newEntry = new ExamTimeTableCenter();
                newEntry.setExamTimeTable(examTimeTable);
                newEntry.setExamCenter(examCenter);
                newEntry.setNumOfCandidates(allocation.getNumOfCandidates()); // Set number of candidates
                examTimeTableCenterRepository.save(newEntry);
            } else {
                existingEntry.setNumOfCandidates(allocation.getNumOfCandidates()); // Update existing record
                examTimeTableCenterRepository.save(existingEntry);
            }
        }
        return "Exam Centers allocated/updated successfully.";
    }


    public String saveOrUpdateSupervisors(AssignSupervisorsDTO dto) {
        for (SupervisorAssignmentDTO assignment : dto.getAssignments()) {
            ExamTimeTableCenter examTimeTableCenter = examTimeTableCenterRepository
                    .findByExamTimeTableExamTimeTableIdAndExamCenterId(assignment.getExamTimeTableId(), assignment.getExamCenterId())
                    .orElseThrow(() -> new RuntimeException("Exam Center allocation not found"));

            UserEntity supervisor = userRepository.findById(assignment.getSupervisorId())
                    .orElseThrow(() -> new RuntimeException("Supervisor not found"));

            examTimeTableCenter.setSupervisor(supervisor);
            examTimeTableCenterRepository.save(examTimeTableCenter);
        }
        return "Supervisors assigned/updated successfully.";
    }

    public String saveOrUpdateInvigilators(AssignInvigilatorsDTO dto) {
        for (InvigilatorAssignmentDTO assignment : dto.getAssignments()) {
            ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(assignment.getExamTimeTableId())
                    .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

            ExamCentersEntity examCenter = examCentersRepository.findById(assignment.getExamCenterId())
                    .orElseThrow(() -> new RuntimeException("Exam Center not found"));

            UserEntity invigilator = userRepository.findById(assignment.getInvigilatorId())
                    .orElseThrow(() -> new RuntimeException("Invigilator not found"));

            ExamInvigilatorsEntity existingEntry = examInvigilatorsRepository
                    .findByExamTimeTablesExamTimeTableIdAndExamCenterIdAndInvigilatorsUserId(
                            assignment.getExamTimeTableId(), assignment.getExamCenterId(), assignment.getInvigilatorId())
                    .orElse(null);

            if (existingEntry == null) {
                ExamInvigilatorsEntity newEntry = new ExamInvigilatorsEntity();
                newEntry.setExamTimeTables(examTimeTable);
                newEntry.setExamCenter(examCenter);
                newEntry.setInvigilators(invigilator);
                examInvigilatorsRepository.save(newEntry);
            }
        }
        return "Invigilators assigned/updated successfully.";
    }


    @Transactional
    public void removeInvigilator(Long invigilatorId) {
        examInvigilatorsRepository.deleteById(invigilatorId);
    }

    @Transactional
    public void removeCenter(Long examCenterId) {
        examTimeTableCenterRepository.deleteById(examCenterId);
    }




    private ExamTimeTableDTO mapToDTO(ExamTimeTablesEntity examTimeTable) {
        ExamTimeTableDTO examTimeTableDTO = new ExamTimeTableDTO();
        examTimeTableDTO.setExamTimeTableId(examTimeTable.getExamTimeTableId());
        examTimeTableDTO.setExaminationId(examTimeTable.getExamination().getId());
        examTimeTableDTO.setCourseId(examTimeTable.getCourse().getId());
        examTimeTableDTO.setExamTypeId(examTimeTable.getExamType().getId());
        examTimeTableDTO.setDate(examTimeTable.getDate());
        examTimeTableDTO.setStartTime(examTimeTable.getStartTime());
        examTimeTableDTO.setEndTime(examTimeTable.getEndTime());
        examTimeTableDTO.setCourseCode(examTimeTable.getCourse().getCode());
        examTimeTableDTO.setCourseName(examTimeTable.getCourse().getName());
        examTimeTableDTO.setExamType(String.valueOf(examTimeTable.getExamType().getExamType()));
        examTimeTableDTO.setUpdatedAt(examTimeTable.getUpdatedAt());
        examTimeTableDTO.setTimetableGroup(examTimeTable.getTimetableGroup());
        return examTimeTableDTO;
    }

    public List<ExamTimeTableWithResourcesDTO> getExamTimeTablesWithResourcesByExamination(Long examinationId) {
        return examTimeTableRepository.findByExaminationId(examinationId)
                .stream()
                .map(this::mapToExamTimeTableWithResourcesDTO)
                .collect(Collectors.toList());
    }

    private ExamTimeTableWithResourcesDTO mapToExamTimeTableWithResourcesDTO(ExamTimeTablesEntity examTimeTable) {
        ExamTimeTableWithResourcesDTO dto = new ExamTimeTableWithResourcesDTO();
        dto.setExamTimeTableId(examTimeTable.getExamTimeTableId());
        dto.setExaminationId(examTimeTable.getExamination().getId());
        dto.setCourseId(examTimeTable.getCourse().getId());
        dto.setExamTypeId(examTimeTable.getExamType().getId());
        dto.setDate(examTimeTable.getDate());
        dto.setStartTime(examTimeTable.getStartTime());
        dto.setEndTime(examTimeTable.getEndTime());
        dto.setCourseCode(examTimeTable.getCourse().getCode());
        dto.setCourseName(examTimeTable.getCourse().getName());
        dto.setExamType(String.valueOf(examTimeTable.getExamType().getExamType()));
        dto.setUpdatedAt(examTimeTable.getUpdatedAt());
        dto.setTimetableGroup(examTimeTable.getTimetableGroup());

        // Set exam centers
        List<ExamTimeTableWithResourcesDTO.ExamCenterDTO> centers = examTimeTable.getExamCenters().stream()
                .map(center -> {
                    ExamTimeTableWithResourcesDTO.ExamCenterDTO centerDTO = new ExamTimeTableWithResourcesDTO.ExamCenterDTO();
                    centerDTO.setAllocationId(center.getId());
                    centerDTO.setExamCenterId(center.getExamCenter().getId());
                    centerDTO.setExamCenterName(center.getExamCenter().getExamCenterName());
                    centerDTO.setLocation(center.getExamCenter().getExamCenterLocation());
                    centerDTO.setCapacity(String.valueOf(center.getExamCenter().getExamCenterCapacity()));
                    centerDTO.setNumOfCandidates(center.getNumOfCandidates());

                    // Set supervisor (if exists) for this center
                    if (center.getSupervisor() != null) {
                        ExamTimeTableWithResourcesDTO.SupervisorDTO supervisorDTO = new ExamTimeTableWithResourcesDTO.SupervisorDTO();
                        supervisorDTO.setSupervisorId(center.getSupervisor().getUserId());
                        supervisorDTO.setSupervisorName(center.getSupervisor().getFirstName() + ' ' + center.getSupervisor().getLastName());
                        supervisorDTO.setEmail(center.getSupervisor().getEmail());
                        centerDTO.setSupervisor(supervisorDTO);
                    }

                    // Set invigilators for this center
                    List<ExamTimeTableWithResourcesDTO.InvigilatorDTO> centerInvigilators = center.getExamCenter().getExamInvigilatorsEntities().stream()
                            .filter(invigilator -> invigilator.getExamTimeTables().getExamTimeTableId().equals(examTimeTable.getExamTimeTableId()) && // Match timetableId
                                    invigilator.getExamCenter().getId().equals(center.getExamCenter().getId())) // Match centerId
                            .map(invigilator -> {
                                ExamTimeTableWithResourcesDTO.InvigilatorDTO invigilatorDTO = new ExamTimeTableWithResourcesDTO.InvigilatorDTO();
                                invigilatorDTO.setAssignedId(invigilator.getId());
                                invigilatorDTO.setInvigilatorId(invigilator.getInvigilators().getUserId());
                                invigilatorDTO.setInvigilatorName(invigilator.getInvigilators().getFirstName() + ' ' + invigilator.getInvigilators().getLastName());
                                invigilatorDTO.setEmail(invigilator.getInvigilators().getEmail());
                                return invigilatorDTO;
                            }).collect(Collectors.toList());
                    centerDTO.setInvigilators(centerInvigilators);

                    return centerDTO;
                }).collect(Collectors.toList());

        dto.setExamCenters(centers);

        return dto;
    }




}
