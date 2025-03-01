package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExamTypesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.timetable.dto.ExamTimeTableDTO;
import com.example.examManagementBackend.timetable.entities.ExamCentersEntity;
import com.example.examManagementBackend.timetable.entities.ExamInvigilatorsEntity;
import com.example.examManagementBackend.timetable.entities.ExamTimeTablesEntity;
import com.example.examManagementBackend.timetable.repository.ExamCentersRepository;
import com.example.examManagementBackend.timetable.repository.ExamInvigilatorsRepository;
import com.example.examManagementBackend.timetable.repository.ExaminationTimeTableRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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




    public ExamTimeTablesService(ExaminationTimeTableRepository examTimeTableRepository,
                                 ExamInvigilatorsRepository examInvigilatorsRepository,
                                 ExamCentersRepository examCentersRepository,
                                 UserManagementRepo userRepository, ExaminationRepository examinationRepository, CoursesRepository coursesRepository, ExamTypesRepository examTypesRepository) {
        this.examTimeTableRepository = examTimeTableRepository;
        this.examInvigilatorsRepository = examInvigilatorsRepository;
        this.examCentersRepository = examCentersRepository;
        this.userRepository = userRepository;
        this.examinationRepository = examinationRepository;
        this.coursesRepository = coursesRepository;
        this.examTypesRepository = examTypesRepository;
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

    public ExamInvigilatorsEntity assignInvigilator(Long examTimeTableId, Long invigilatorId) {
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(examTimeTableId)
                .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));
        UserEntity invigilator = userRepository.findById(invigilatorId)
                .orElseThrow(() -> new RuntimeException("Invigilator not found"));
        ExamInvigilatorsEntity examInvigilator = new ExamInvigilatorsEntity();
        examInvigilator.setExamTimeTables(examTimeTable);
        examInvigilator.setInvigilators(invigilator);
        return examInvigilatorsRepository.save(examInvigilator);
    }

    public ExamTimeTablesEntity assignExamCenter(Long examTimeTableId, Long centerId) {
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(examTimeTableId)
                .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));
        ExamCentersEntity center = examCentersRepository.findById(centerId)
                .orElseThrow(() -> new RuntimeException("Exam Center not found"));
        examTimeTable.getCenters().add(center);
        return examTimeTableRepository.save(examTimeTable);
    }

    public ExamTimeTablesEntity assignSupervisor(Long examTimeTableId, Long supervisorId) {
        ExamTimeTablesEntity examTimeTable = examTimeTableRepository.findById(examTimeTableId)
                .orElseThrow(() -> new RuntimeException("Exam Time Table not found"));
        UserEntity supervisor = userRepository.findById(supervisorId)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        examTimeTable.setSupervisor(supervisor);
        return examTimeTableRepository.save(examTimeTable);
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
        examTimeTableDTO.setExamType(String.valueOf(examTimeTable.getExamType().getName()));
        examTimeTableDTO.setUpdatedAt(examTimeTable.getUpdatedAt());
        return examTimeTableDTO;
    }
}
