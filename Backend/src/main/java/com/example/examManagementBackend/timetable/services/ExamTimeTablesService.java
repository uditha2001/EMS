package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.calendar.Event;
import com.example.examManagementBackend.calendar.EventRepository;
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
import com.example.examManagementBackend.timetable.entities.*;
import com.example.examManagementBackend.timetable.repository.*;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final EventRepository eventRepository;
    private final TimeSlotChangeLogRepository timeSlotChangeLogRepository;


    public ExamTimeTablesService(ExaminationTimeTableRepository examTimeTableRepository,
                                 ExamInvigilatorsRepository examInvigilatorsRepository,
                                 ExamCentersRepository examCentersRepository,
                                 UserManagementRepo userRepository, ExaminationRepository examinationRepository, CoursesRepository coursesRepository, ExamTypesRepository examTypesRepository, ExamTimeTableCenterRepository examTimeTableCenterRepository, EncryptedPaperRepository encryptedPaperRepository, EventRepository eventRepository, TimeSlotChangeLogRepository timeSlotChangeLogRepository) {
        this.examTimeTableRepository = examTimeTableRepository;
        this.examInvigilatorsRepository = examInvigilatorsRepository;
        this.examCentersRepository = examCentersRepository;
        this.userRepository = userRepository;
        this.examinationRepository = examinationRepository;
        this.coursesRepository = coursesRepository;
        this.examTypesRepository = examTypesRepository;
        this.examTimeTableCenterRepository = examTimeTableCenterRepository;
        this.encryptedPaperRepository = encryptedPaperRepository;
        this.eventRepository = eventRepository;
        this.timeSlotChangeLogRepository = timeSlotChangeLogRepository;
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

//            // Check if the timetable is already approved
//            if (examTimeTable.isApproved()) {
//                throw new RuntimeException("Cannot update an approved timetable.");
//            }

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


    @Transactional
    public String saveOrUpdateSupervisors(AssignSupervisorsDTO dto) {
        for (SupervisorAssignmentDTO assignment : dto.getAssignments()) {
            ExamTimeTableCenter examTimeTableCenter = examTimeTableCenterRepository
                    .findByExamTimeTableExamTimeTableIdAndExamCenterId(assignment.getExamTimeTableId(), assignment.getExamCenterId())
                    .orElseThrow(() -> new RuntimeException("Exam Center allocation not found"));

            UserEntity supervisor = userRepository.findById(assignment.getSupervisorId())
                    .orElseThrow(() -> new RuntimeException("Supervisor not found"));

            examTimeTableCenter.setSupervisor(supervisor);
            examTimeTableCenterRepository.save(examTimeTableCenter);

            // Create event for supervisor
            createSupervisorEvent(examTimeTableCenter, supervisor);
        }
        return "Supervisors assigned/updated successfully.";
    }

    private void createSupervisorEvent(ExamTimeTableCenter examTimeTableCenter, UserEntity supervisor) {
        ExamTimeTablesEntity examTimeTable = examTimeTableCenter.getExamTimeTable();

        Event event = new Event();
        event.setTitle("Exam Supervision - " + examTimeTable.getCourse().getCode());
        event.setDescription("Supervising exam for " + examTimeTable.getCourse().getName() +
                " at " + examTimeTableCenter.getExamCenter().getExamCenterName());
        event.setStartDate(LocalDateTime.of(examTimeTable.getDate(), examTimeTable.getStartTime()));
        event.setEndDate(LocalDateTime.of(examTimeTable.getDate(), examTimeTable.getEndTime()));
        event.setLocation(examTimeTableCenter.getExamCenter().getExamCenterLocation());
        event.setVisibility(Event.Visibility.PRIVATE);
        event.setUserId(supervisor.getUserId());

        eventRepository.save(event);
    }

    @Transactional
    public String saveOrUpdateInvigilators(AssignInvigilatorsDTO dto) {
        for (InvigilatorAssignmentDTO assignment : dto.getAssignments()) {
            ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(assignment.getExamTimeTableId())
                    .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

//            // Check if the timetable is already approved
//            if (examTimeTable.isApproved()) {
//                throw new RuntimeException("Cannot update an approved timetable.");
//            }

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

                // Create event for invigilator
                createInvigilatorEvent(examTimeTable, examCenter, invigilator);
            }
        }
        return "Invigilators assigned/updated successfully.";
    }

    private void createInvigilatorEvent(ExamTimeTablesEntity examTimeTable, ExamCentersEntity examCenter, UserEntity invigilator) {
        Event event = new Event();
        event.setTitle("Exam Invigilation - " + examTimeTable.getCourse().getCode());
        event.setDescription("Invigilating exam for " + examTimeTable.getCourse().getName() +
                " at " + examCenter.getExamCenterName());
        event.setStartDate(LocalDateTime.of(examTimeTable.getDate(), examTimeTable.getStartTime()));
        event.setEndDate(LocalDateTime.of(examTimeTable.getDate(), examTimeTable.getEndTime()));
        event.setLocation(examCenter.getExamCenterLocation());
        event.setVisibility(Event.Visibility.PRIVATE);
        event.setUserId(invigilator.getUserId());

        eventRepository.save(event);
    }


    @Transactional
    public void removeInvigilator(Long invigilatorId) {
        ExamInvigilatorsEntity invigilatorAssignment = examInvigilatorsRepository.findById(invigilatorId)
                .orElseThrow(() -> new RuntimeException("Invigilator assignment not found"));

        // Delete associated event
        eventRepository.deleteByTitleContainingAndUserId(
                "Exam Invigilation - " + invigilatorAssignment.getExamTimeTables().getCourse().getCode(),
                invigilatorAssignment.getInvigilators().getUserId());

        examInvigilatorsRepository.deleteById(invigilatorId);
    }

    @Transactional
    public void removeCenter(Long examCenterId) {
        ExamTimeTableCenter centerAssignment = examTimeTableCenterRepository.findById(examCenterId)
                .orElseThrow(() -> new RuntimeException("Exam center assignment not found"));

        if (centerAssignment.getSupervisor() != null) {
            // Delete supervisor's event
            eventRepository.deleteByTitleContainingAndUserId(
                    "Exam Supervision - " + centerAssignment.getExamTimeTable().getCourse().getCode(),
                    centerAssignment.getSupervisor().getUserId());
        }

        // Delete all invigilators' events for this center
        List<ExamInvigilatorsEntity> invigilators = examInvigilatorsRepository
                .findByExamTimeTablesExamTimeTableIdAndExamCenterId(
                        centerAssignment.getExamTimeTable().getExamTimeTableId(),
                        centerAssignment.getExamCenter().getId());

        for (ExamInvigilatorsEntity invigilator : invigilators) {
            eventRepository.deleteByTitleContainingAndUserId(
                    "Exam Invigilation - " + centerAssignment.getExamTimeTable().getCourse().getCode(),
                    invigilator.getInvigilators().getUserId());
        }

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

        List<Long> approvedTimetables = new ArrayList<>();
        List<String> skippedTimetables = new ArrayList<>();

        // First pass: Check all Theory/Practical timetables have papers
        Map<Long, Boolean> courseHasPaper = new HashMap<>();
        for (ExamTimeTablesEntity examTimeTable : examTimeTables) {
            if (examTimeTable.isApproved()) {
                continue;
            }

            Long courseId = examTimeTable.getCourse().getId();
            if ((examTimeTable.getExamType().getExamType().equals("THEORY") ||
                    examTimeTable.getExamType().getExamType().equals("PRACTICAL")) &&
                    !courseHasPaper.containsKey(courseId)) {

                boolean paperExists = encryptedPaperRepository.existsByCourseIdAndExaminationIdAndPaperTypeIn(
                        courseId,
                        examinationId,
                        List.of(PaperType.THEORY, PaperType.PRACTICAL)
                );

                courseHasPaper.put(courseId, paperExists);
            }
        }

        // Second pass: Approve timetables
        for (ExamTimeTablesEntity examTimeTable : examTimeTables) {
            if (examTimeTable.isApproved()) {
                continue;
            }

            // Check paper requirement for Theory/Practical exams
            if (examTimeTable.getExamType().getExamType().equals("THEORY") ||
                    examTimeTable.getExamType().getExamType().equals("PRACTICAL")) {

                if (!courseHasPaper.getOrDefault(examTimeTable.getCourse().getId(), false)) {
                    skippedTimetables.add(examTimeTable.getCourse().getCode() + " - " +
                            examTimeTable.getCourse().getName());
                    continue;
                }
            }

            // Approve the timetable
            examTimeTable.setApproved(true);
            examTimeTableRepository.save(examTimeTable);
            approvedTimetables.add(examTimeTable.getExamTimeTableId());
        }

        // Third pass: Update paper sharedAt dates with earliest time slots
        updateAllPaperSharedDatesWithEarliestTimeSlots(examinationId);

        if (approvedTimetables.isEmpty() && !skippedTimetables.isEmpty()) {
            return "No timetables were approved. Missing papers for: " + String.join(", ", skippedTimetables);
        }

        String response = "Approved " + approvedTimetables.size() + " timetables.";
        if (!skippedTimetables.isEmpty()) {
            response += " Skipped due to missing papers: " + String.join(", ", skippedTimetables);
        }

        return response;
    }

    private void updateAllPaperSharedDatesWithEarliestTimeSlots(Long examinationId) {
        // Get all courses with Theory/Practical exams in this examination
        List<Long> courseIds = examTimeTableRepository
                .findDistinctCourseIdsByExaminationIdAndExamTypeIn(
                        examinationId,
                        List.of("THEORY", "PRACTICAL"));

        for (Long courseId : courseIds) {
            // Get all approved timetables for this course and examination
            List<ExamTimeTablesEntity> timetables = examTimeTableRepository
                    .findByCourseIdAndExaminationIdAndApprovedTrue(
                            courseId,
                            examinationId);

            if (!timetables.isEmpty()) {
                // Find the earliest exam date and time
                LocalDateTime earliestDateTime = timetables.stream()
                        .map(t -> LocalDateTime.of(t.getDate(), t.getStartTime()))
                        .min(LocalDateTime::compareTo)
                        .get();

                // Update both Theory and Practical papers if they exist
                for (PaperType paperType : List.of(PaperType.THEORY, PaperType.PRACTICAL)) {
                    encryptedPaperRepository.findByCourseIdAndExaminationIdAndPaperType(
                                    courseId,
                                    examinationId,
                                    paperType)
                            .ifPresent(paper -> {
                                paper.setSharedAt(earliestDateTime);
                                encryptedPaperRepository.save(paper);
                            });
                }
            }
        }
    }

    @Transactional
    public String approveExamTimeTableById(Long examTimeTableId) {
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(examTimeTableId)
                .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

        if (examTimeTable.isApproved()) {
            throw new RuntimeException("Timetable is already approved.");
        }

        // Check if this is a Theory or Practical exam
        if (examTimeTable.getExamType().getExamType().equals("THEORY") ||
                examTimeTable.getExamType().getExamType().equals("PRACTICAL")) {

            // Check if paper exists for this course and examination
            boolean paperExists = encryptedPaperRepository.existsByCourseIdAndExaminationIdAndPaperTypeIn(
                    examTimeTable.getCourse().getId(),
                    examTimeTable.getExamination().getId(),
                    List.of(PaperType.THEORY, PaperType.PRACTICAL)
            );

            if (!paperExists) {
                throw new RuntimeException("Cannot approve timetable. Paper not found for course: " +
                        examTimeTable.getCourse().getCode() + " - " + examTimeTable.getCourse().getName());
            }
        }

        // Approve the timetable
        examTimeTable.setApproved(true);
        examTimeTableRepository.save(examTimeTable);

        // Update paper sharedAt date with the earliest time slot if applicable
        if (examTimeTable.getExamType().getExamType().equals("THEORY") ||
                examTimeTable.getExamType().getExamType().equals("PRACTICAL")) {

            updatePaperSharedDateWithEarliestTimeSlot(examTimeTable);
        }

        return "Timetable ID " + examTimeTableId + " has been approved successfully.";
    }

    private void updatePaperSharedDateWithEarliestTimeSlot(ExamTimeTablesEntity examTimeTable) {
        // Get all approved timetables for this course and examination
        List<ExamTimeTablesEntity> timetables = examTimeTableRepository
                .findByCourseIdAndExaminationIdAndApprovedTrue(
                        examTimeTable.getCourse().getId(),
                        examTimeTable.getExamination().getId());

        // Find the earliest exam date and time
        LocalDateTime earliestDateTime = timetables.stream()
                .map(t -> LocalDateTime.of(t.getDate(), t.getStartTime()))
                .min(LocalDateTime::compareTo)
                .orElse(LocalDateTime.of(examTimeTable.getDate(), examTimeTable.getStartTime()));

        // Update the paper's sharedAt date
        PaperType paperType = examTimeTable.getExamType().getExamType().equals("THEORY") ?
                PaperType.THEORY : PaperType.PRACTICAL;

        encryptedPaperRepository.findByCourseIdAndExaminationIdAndPaperType(
                        examTimeTable.getCourse().getId(),
                        examTimeTable.getExamination().getId(),
                        paperType)
                .ifPresent(paper -> {
                    paper.setSharedAt(earliestDateTime);
                    encryptedPaperRepository.save(paper);
                });
    }

    @Transactional
    public ExamTimeTableDTO changeTimeSlotAfterApproval(TimeSlotChangeRequestDTO requestDTO) {
        // Get the current timetable
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(requestDTO.getExamTimeTableId())
                .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));

        // Verify the timetable is approved
        if (!examTimeTable.isApproved()) {
            throw new RuntimeException("Time slot can only be changed for approved timetables");
        }

        // Create DTO and check for conflicts
        ExamTimeTableDTO examTimeTableDTO = mapToDTO(examTimeTable);
        checkForConflictsWithNewTimeSlot(examTimeTable, requestDTO, examTimeTableDTO);

        // If there are conflicts, return the DTO without updating
        if (!examTimeTableDTO.getConflictMessages().isEmpty()) {
            return examTimeTableDTO;
        }

        // Log the change before making updates
        logTimeSlotChange(examTimeTable, requestDTO);

        // Update the time slot
        examTimeTable.setDate(requestDTO.getNewDate());
        examTimeTable.setStartTime(requestDTO.getNewStartTime());
        examTimeTable.setEndTime(requestDTO.getNewEndTime());


        // Save the updated timetable
        examTimeTable = examTimeTableRepository.save(examTimeTable);

        // Update all related events (supervisors and invigilators)
        updateRelatedEvents(examTimeTable);

        changePaperPublishDate(examTimeTable.getExamTimeTableId());

        return mapToDTO(examTimeTable);
    }


    private void changePaperPublishDate(Long examTimetableId) {

        // Fetch the specific exam timetable entry
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(examTimetableId)
                .orElseThrow(() -> new RuntimeException("Exam timetable not found for the given ID."));

        Long examinationId = examTimeTable.getExamination().getId(); // Get the related examination ID

        // Find all encrypted papers linked to this examination
        List<EncryptedPaper> encryptedPapers = encryptedPaperRepository.findByExaminationId(examinationId);

        // Get the exam start datetime from the specific exam timetable
        LocalDateTime examStartDateTime = examTimeTable.getStartTime().atDate(examTimeTable.getDate());

        for (EncryptedPaper paper : encryptedPapers) {
            if (paper.getPaperType() == PaperType.THEORY || paper.getPaperType() == PaperType.PRACTICAL) {
                if (paper.getCourse().getId().equals(examTimeTable.getCourse().getId())) {
                    paper.setSharedAt(examStartDateTime);
                    encryptedPaperRepository.save(paper);
                }
            }
        }
    }


    private void checkForConflictsWithNewTimeSlot(ExamTimeTablesEntity examTimeTable,
                                                  TimeSlotChangeRequestDTO requestDTO,
                                                  ExamTimeTableDTO examTimeTableDTO) {
        List<String> conflicts = new ArrayList<>();

        // Check for conflicts with the same degree and year
        List<ExamTimeTablesEntity> conflictingTimetables = examTimeTableRepository
                .findByExaminationDegreeAndYearAndOverlappingTime(
                        examTimeTable.getExamination().getDegreeProgramsEntity().getDegreeName(),
                        examTimeTable.getExamination().getYear(),
                        requestDTO.getNewDate(),
                        requestDTO.getNewStartTime(),
                        requestDTO.getNewEndTime(),
                        examTimeTable.getExamTimeTableId());  // Exclude current timetable

        if (!conflictingTimetables.isEmpty()) {
            conflicts.add("The new time slot conflicts with existing exams for the same degree and year.");
        }

        // Check for exam center conflicts
        List<ExamTimeTableCenter> centers = examTimeTableCenterRepository
                .findByExamTimeTableExamTimeTableId(examTimeTable.getExamTimeTableId());

        for (ExamTimeTableCenter center : centers) {
            List<ExamTimeTablesEntity> centerConflicts = examTimeTableRepository
                    .findByExamCenterAndOverlappingTime(
                            center.getExamCenter().getId(),
                            requestDTO.getNewDate(),
                            requestDTO.getNewStartTime(),
                            requestDTO.getNewEndTime(),
                            examTimeTable.getExamTimeTableId());  // Exclude current timetable

            if (!centerConflicts.isEmpty()) {
                conflicts.add("The new time slot conflicts with exams at center: " +
                        center.getExamCenter().getExamCenterName());
            }
        }

        // Check for invigilator conflicts
        List<ExamInvigilatorsEntity> invigilators = examInvigilatorsRepository
                .findByExamTimeTablesExamTimeTableId(examTimeTable.getExamTimeTableId());

        for (ExamInvigilatorsEntity invigilator : invigilators) {
            List<ExamTimeTablesEntity> invigilatorConflicts = examTimeTableRepository
                    .findByInvigilatorAndOverlappingTime(
                            invigilator.getInvigilators().getUserId(),
                            requestDTO.getNewDate(),
                            requestDTO.getNewStartTime(),
                            requestDTO.getNewEndTime(),
                            examTimeTable.getExamTimeTableId());  // Exclude current timetable

            if (!invigilatorConflicts.isEmpty()) {
                conflicts.add("The new time slot conflicts with invigilator: " +
                        invigilator.getInvigilators().getFirstName() + " " +
                        invigilator.getInvigilators().getLastName());
            }
        }

        // Set conflicts in DTO
        examTimeTableDTO.getConflictMessages().addAll(conflicts);
    }


    private void logTimeSlotChange(ExamTimeTablesEntity examTimeTable, TimeSlotChangeRequestDTO requestDTO) {
        TimeSlotChangeLog changeLog = new TimeSlotChangeLog();
        changeLog.setExamTimeTable(examTimeTable);
        changeLog.setPreviousDate(examTimeTable.getDate());
        changeLog.setPreviousStartTime(examTimeTable.getStartTime());
        changeLog.setPreviousEndTime(examTimeTable.getEndTime());
        changeLog.setNewDate(requestDTO.getNewDate());
        changeLog.setNewStartTime(requestDTO.getNewStartTime());
        changeLog.setNewEndTime(requestDTO.getNewEndTime());
        changeLog.setChangeReason(requestDTO.getChangeReason());
        changeLog.setChangeTimestamp(LocalDateTime.now());

        // Get current user (you'll need to implement this based on your auth system)
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        changeLog.setChangedBy(currentUser);

        timeSlotChangeLogRepository.save(changeLog);
    }

    private void updateRelatedEvents(ExamTimeTablesEntity examTimeTable) {
        // Update supervisor events
        List<ExamTimeTableCenter> centers = examTimeTableCenterRepository
                .findByExamTimeTableExamTimeTableId(examTimeTable.getExamTimeTableId());

        for (ExamTimeTableCenter center : centers) {
            if (center.getSupervisor() != null) {
                // Delete old event
                eventRepository.deleteByTitleContainingAndUserId(
                        "Exam Supervision - " + examTimeTable.getCourse().getCode(),
                        center.getSupervisor().getUserId());

                // Create new event
                createSupervisorEvent(center, center.getSupervisor());
            }
        }

        // Update invigilator events
        List<ExamInvigilatorsEntity> invigilators = examInvigilatorsRepository
                .findByExamTimeTablesExamTimeTableId(examTimeTable.getExamTimeTableId());

        for (ExamInvigilatorsEntity invigilator : invigilators) {
            // Delete old event
            eventRepository.deleteByTitleContainingAndUserId(
                    "Exam Invigilation - " + examTimeTable.getCourse().getCode(),
                    invigilator.getInvigilators().getUserId());

            // Create new event
            createInvigilatorEvent(examTimeTable, invigilator.getExamCenter(), invigilator.getInvigilators());
        }


    }

}
