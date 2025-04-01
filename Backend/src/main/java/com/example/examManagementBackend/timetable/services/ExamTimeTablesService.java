package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.EncryptedPaper;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    private final EncryptedPaperRepository encryptedPaperRepository;




    public ExamTimeTablesService(ExaminationTimeTableRepository examTimeTableRepository,
                                 ExamInvigilatorsRepository examInvigilatorsRepository,
                                 ExamCentersRepository examCentersRepository,
                                 UserManagementRepo userRepository, ExaminationRepository examinationRepository, CoursesRepository coursesRepository, ExamTypesRepository examTypesRepository, ExamTimeTableCenterRepository examTimeTableCenterRepository, EncryptedPaperRepository encryptedPaperRepository) {
        this.examTimeTableRepository = examTimeTableRepository;
        this.examInvigilatorsRepository = examInvigilatorsRepository;
        this.examCentersRepository = examCentersRepository;
        this.userRepository = userRepository;
        this.examinationRepository = examinationRepository;
        this.coursesRepository = coursesRepository;
        this.examTypesRepository = examTypesRepository;
        this.examTimeTableCenterRepository = examTimeTableCenterRepository;
        this.encryptedPaperRepository = encryptedPaperRepository;
    }

    public List<ExamTimeTableDTO> saveOrUpdateExamTimeTable(List<ExamTimeTableDTO> examTimeTableDTOList) {
        List<ExamTimeTablesEntity> examTimeTables = new ArrayList<>();

        for (ExamTimeTableDTO examTimeTableDTO : examTimeTableDTOList) {
            ExamTimeTablesEntity examTimeTable;

            if (examTimeTableDTO.getExamTimeTableId() != null && examTimeTableDTO.getExamTimeTableId() > 0) {
                // Update existing record
                examTimeTable = examTimeTableRepository.findById(examTimeTableDTO.getExamTimeTableId())
                        .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

                // Check if the timetable is already approved
                if (examTimeTable.isApproved()) {
                    throw new RuntimeException("Cannot update an approved timetable.");
                }
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

    public List<ExamTimeTableDTO> getSynchronizeTimetables(List<Long> examinationIds) {
        return examTimeTableRepository.findByExaminationIdIn(examinationIds)
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

            // Check if the timetable is already approved
            if (examTimeTable.isApproved()) {
                throw new RuntimeException("Cannot update an approved timetable.");
            }

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

            // Check if the timetable is already approved
            if (examTimeTable.isApproved()) {
                throw new RuntimeException("Cannot update an approved timetable.");
            }

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
        examTimeTableDTO.setDegree(examTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName());
        examTimeTableDTO.setYear(examTimeTable.getExamination().getYear());
        examTimeTableDTO.setLevel(examTimeTable.getExamination().getLevel());
        examTimeTableDTO.setSemester(examTimeTable.getExamination().getSemester());
        examTimeTableDTO.setApprove(examTimeTable.isApproved());

        return examTimeTableDTO;
    }

    public List<ExamTimeTableWithResourcesDTO> getExamTimeTablesWithResourcesByExamination(Long examinationId) {
        return examTimeTableRepository.findByExaminationId(examinationId)
                .stream()
                .map(this::mapToExamTimeTableWithResourcesDTO)
                .collect(Collectors.toList());
    }

    public List<ExamTimeTableWithResourcesDTO> getExamTimeTablesWithResourcesByExamination(List<Long> examinationIds) {
        return examTimeTableRepository.findByExaminationIdIn(examinationIds)
                .stream()
                .map(this::mapToExamTimeTableWithResourcesDTO)
                .collect(Collectors.toList());
    }

    private ExamTimeTableWithResourcesDTO mapToExamTimeTableWithResourcesDTO(ExamTimeTablesEntity examTimeTable) {
        ExamTimeTableWithResourcesDTO dto = new ExamTimeTableWithResourcesDTO();
        dto.setExamTimeTableId(examTimeTable.getExamTimeTableId());
        dto.setExaminationId(examTimeTable.getExamination().getId());
        dto.setDegree(examTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName());
        dto.setYear(examTimeTable.getExamination().getYear());
        dto.setLevel(examTimeTable.getExamination().getLevel());
        dto.setSemester(examTimeTable.getExamination().getSemester());
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
        dto.setApprove(examTimeTable.isApproved());

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

    public List<ExamTimeTableWithResourcesDTO> checkConflicts(List<Long> examinationIds) {
        List<ExamTimeTablesEntity> examTimeTables = examTimeTableRepository.findByExaminationIdIn(examinationIds);

        // A map to store conflicts grouped by examTimeTableId
        Map<Long, ExamTimeTableWithResourcesDTO> conflictsMap = new HashMap<>();

        for (int i = 0; i < examTimeTables.size(); i++) {
            ExamTimeTablesEntity examTimeTable = examTimeTables.get(i);

            // Check for conflicts with the same degree, year, and overlapping time slot
            for (int j = i + 1; j < examTimeTables.size(); j++) {
                ExamTimeTablesEntity otherExamTimeTable = examTimeTables.get(j);

                // Check degree, year, and overlapping time slot conflict
                if (examTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName().equals(otherExamTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName()) &&
                        examTimeTable.getExamination().getYear().equals(otherExamTimeTable.getExamination().getYear()) &&
                        examTimeTable.getDate().equals(otherExamTimeTable.getDate()) &&
                        examTimeTable.getStartTime().isBefore(otherExamTimeTable.getEndTime()) &&
                        examTimeTable.getEndTime().isAfter(otherExamTimeTable.getStartTime())) {

                    String conflictMessage = "Conflict between exams for Degree: " + examTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName() +
                            " - Year: " + examTimeTable.getExamination().getYear() +
                            " at " + examTimeTable.getDate() + " " + examTimeTable.getStartTime() + " - " + examTimeTable.getEndTime();

                    // Create or update the conflict DTO for this examTimeTableId
                    conflictsMap.computeIfAbsent(examTimeTable.getExamTimeTableId(), id -> mapToExamTimeTableWithResourcesDTO(examTimeTable))
                            .addConflictMessage(conflictMessage);
                }
            }

            // Check for conflicts in overlapping time slots for the exam centers, invigilators, and supervisors
            List<ExamTimeTableCenter> centers = examTimeTableCenterRepository.findByExamTimeTableExamTimeTableId(examTimeTable.getExamTimeTableId());
            for (ExamTimeTableCenter center : centers) {
                // Check for exam center conflicts in overlapping time slots
                List<ExamTimeTablesEntity> conflictingExamsForCenter = examTimeTableRepository.findByExamTimeTableCenterAndOverlappingTimeSlot(
                        center.getExamCenter().getId(), examTimeTable.getDate(), examTimeTable.getStartTime(), examTimeTable.getEndTime());

                for (ExamTimeTablesEntity conflictingExam : conflictingExamsForCenter) {
                    if (!conflictingExam.getExamTimeTableId().equals(examTimeTable.getExamTimeTableId())) {
                        String conflictMessage = "Conflict in Exam Center: " + center.getExamCenter().getExamCenterName() +
                                " for time slot " + examTimeTable.getDate() + " " + examTimeTable.getStartTime() + " - " + examTimeTable.getEndTime();

                        conflictsMap.computeIfAbsent(examTimeTable.getExamTimeTableId(), id -> mapToExamTimeTableWithResourcesDTO(examTimeTable))
                                .addConflictMessage(conflictMessage);
                    }
                }

                // Check for invigilator conflicts in overlapping time slots
                List<ExamInvigilatorsEntity> invigilators = examInvigilatorsRepository.findByExamTimeTablesExamTimeTableIdAndExamCenterId(
                        examTimeTable.getExamTimeTableId(), center.getExamCenter().getId());

                for (ExamInvigilatorsEntity invigilator : invigilators) {
                    List<ExamTimeTablesEntity> conflictingExamsForInvigilator = examTimeTableRepository.findByInvigilatorAndOverlappingTimeSlot(
                            invigilator.getInvigilators().getUserId(), examTimeTable.getDate(), examTimeTable.getStartTime(), examTimeTable.getEndTime());

                    for (ExamTimeTablesEntity conflictingExam : conflictingExamsForInvigilator) {
                        if (!conflictingExam.getExamTimeTableId().equals(examTimeTable.getExamTimeTableId())) {
                            String conflictMessage = "Conflict with Invigilator: " + invigilator.getInvigilators().getFirstName() +
                                    " " + invigilator.getInvigilators().getLastName() +
                                    " for time slot " + examTimeTable.getDate() + " " + examTimeTable.getStartTime() + " - " + examTimeTable.getEndTime();

                            conflictsMap.computeIfAbsent(examTimeTable.getExamTimeTableId(), id -> mapToExamTimeTableWithResourcesDTO(examTimeTable))
                                    .addConflictMessage(conflictMessage);
                        }
                    }
                }

                // Check for supervisor conflicts in overlapping time slots
                if (center.getSupervisor() != null) {
                    List<ExamTimeTablesEntity> conflictingExamsForSupervisor = examTimeTableRepository.findBySupervisorAndOverlappingTimeSlot(
                            center.getSupervisor().getUserId(), examTimeTable.getDate(), examTimeTable.getStartTime(), examTimeTable.getEndTime());

                    for (ExamTimeTablesEntity conflictingExam : conflictingExamsForSupervisor) {
                        if (!conflictingExam.getExamTimeTableId().equals(examTimeTable.getExamTimeTableId())) {
                            String conflictMessage = "Conflict with Supervisor: " + center.getSupervisor().getFirstName() +
                                    " " + center.getSupervisor().getLastName() +
                                    " for time slot " + examTimeTable.getDate() + " " + examTimeTable.getStartTime() + " - " + examTimeTable.getEndTime();

                            conflictsMap.computeIfAbsent(examTimeTable.getExamTimeTableId(), id -> mapToExamTimeTableWithResourcesDTO(examTimeTable))
                                    .addConflictMessage(conflictMessage);
                        }
                    }
                }
            }
        }

        // Return the conflicts as a list of DTOs
        return new ArrayList<>(conflictsMap.values());
    }

    @Transactional
    public String approveExamTimeTable(Long examinationId) {
        List<ExamTimeTablesEntity> examTimeTables = examTimeTableRepository.findByExaminationId(examinationId);

        if (examTimeTables.isEmpty()) {
            throw new RuntimeException("No exam timetables found for the given examination ID.");
        }

        for (ExamTimeTablesEntity examTimeTable : examTimeTables) {
            if (examTimeTable.isApproved()) {
                throw new RuntimeException("Timetable for examination ID " + examinationId + " is already approved.");
            }

            // Approve the timetable
            examTimeTable.setApproved(true);
            examTimeTableRepository.save(examTimeTable);
        }

        // Find all encrypted papers linked to this examination
        List<EncryptedPaper> encryptedPapers = encryptedPaperRepository.findByExaminationId(examinationId);

        // Group timetables by course ID and get the earliest exam start date for each course
        Map<Long, LocalDateTime> earliestExamDates = examTimeTables.stream()
                .collect(Collectors.toMap(
                        t -> t.getCourse().getId(), // Key: Course ID
                        t -> t.getStartTime().atDate(t.getDate()), // Value: Exam Start DateTime
                        (d1, d2) -> d1.isBefore(d2) ? d1 : d2
                ));

        for (EncryptedPaper paper : encryptedPapers) {
            if (paper.getPaperType() == PaperType.THEORY || paper.getPaperType() == PaperType.PRACTICAL) {
                LocalDateTime earliestDate = earliestExamDates.get(paper.getCourse().getId());

                if (earliestDate != null) {
                    paper.setSharedAt(earliestDate);
                    encryptedPaperRepository.save(paper);
                }
            }
        }

        return "Timetable for examination ID " + examinationId + " has been approved successfully, and relevant encrypted papers' sharedAt dates have been set to the earliest exam start date.";
    }



}
