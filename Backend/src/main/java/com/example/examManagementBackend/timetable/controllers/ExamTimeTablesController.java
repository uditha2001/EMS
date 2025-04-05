package com.example.examManagementBackend.timetable.controllers;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.repository.EncryptedPaperRepository;
import com.example.examManagementBackend.timetable.dto.*;
import com.example.examManagementBackend.timetable.services.ExamTimeTablesService;
import com.example.examManagementBackend.timetable.services.TimeSlotChangeLogService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/exam-time-table")
public class ExamTimeTablesController {

    private final ExamTimeTablesService examTimeTableService;

    private final EncryptedPaperRepository encryptedPaperRepository;


    private final TimeSlotChangeLogService timeSlotChangeLogService;

    public ExamTimeTablesController(ExamTimeTablesService examTimeTableService, EncryptedPaperRepository encryptedPaperRepository, TimeSlotChangeLogService timeSlotChangeLogService) {
        this.examTimeTableService = examTimeTableService;
        this.encryptedPaperRepository = encryptedPaperRepository;
        this.timeSlotChangeLogService = timeSlotChangeLogService;
    }

    @PostMapping("/create")
    public StandardResponse createExamTimeTable(@RequestBody List<ExamTimeTableDTO> examTimeTableDTOList) {
        return StandardResponse.success(examTimeTableService.saveOrUpdateExamTimeTable(examTimeTableDTOList));
    }

    @DeleteMapping("/delete/{examTimeTableId}")
    public StandardResponse deleteExamTimeTable(@PathVariable Long examTimeTableId) {
        examTimeTableService.deleteExamTimeTable(examTimeTableId);
        return StandardResponse.success("Exam Time Table deleted successfully");
    }

    @PostMapping("/synchronize")
    public StandardResponse getAllExamTimeTables(@RequestBody List<Long> examinationIds) {
        return StandardResponse.success(examTimeTableService.getSynchronizeTimetables(examinationIds));
    }

    @GetMapping("/exam/{examinationId}")
    public StandardResponse getExamTimeTablesByExamination(@PathVariable Long examinationId) {
        return StandardResponse.success(examTimeTableService.getExamTimeTablesByExamination(examinationId));
    }

    @PostMapping("/allocate-exam-centers")
    public StandardResponse allocateExamCenters(@RequestBody AllocateExamCentersDTO dto) {
        return StandardResponse.success(examTimeTableService.saveOrUpdateExamCenters(dto));
    }

    @PostMapping("/assign-supervisors")
    public StandardResponse assignSupervisors(@RequestBody AssignSupervisorsDTO dto) {
        return StandardResponse.success(examTimeTableService.saveOrUpdateSupervisors(dto));
    }

    @PostMapping("/assign-invigilators")
    public StandardResponse assignInvigilators(@RequestBody AssignInvigilatorsDTO dto) {
        return StandardResponse.success(examTimeTableService.saveOrUpdateInvigilators(dto));
    }

    @GetMapping("/exam/{examinationId}/with-resources")
    public StandardResponse getExamTimeTablesWithResourcesByExamination(@PathVariable Long examinationId) {
        return StandardResponse.success(examTimeTableService.getExamTimeTablesWithResourcesByExamination(examinationId));
    }

    @PostMapping("/exam/with-resources")
    public StandardResponse getExamTimeTablesWithResourcesByExamination(@RequestBody List<Long> examinationIds) {
        return StandardResponse.success(examTimeTableService.getExamTimeTablesWithResourcesByExamination(examinationIds));
    }

    @DeleteMapping("/invigilator/{invigilatorId}")
    public StandardResponse removeInvigilator(@PathVariable Long invigilatorId) {
        examTimeTableService.removeInvigilator(invigilatorId);
        return StandardResponse.success("Invigilator removed successfully.");
    }

    @DeleteMapping("/center/{examCenterId}")
    public StandardResponse removeCenter(@PathVariable Long examCenterId) {
        examTimeTableService.removeCenter(examCenterId);
        return StandardResponse.success("Exam center removed successfully.");
    }

    @PostMapping("/check-conflicts")
    public StandardResponse checkConflicts(@RequestBody List<Long> examinationIds) {
        List<ExamTimeTableWithResourcesDTO> conflicts = examTimeTableService.checkConflicts(examinationIds);
        if (conflicts == null || conflicts.isEmpty()) {
            return StandardResponse.success("No conflicts found.");
        } else {
            return StandardResponse.success(conflicts);
        }
    }

    @PostMapping("/approve/{examinationId}")
    public StandardResponse approveExamTimeTable(@PathVariable Long examinationId) {
        try {
            String result = examTimeTableService.approveExamTimeTable(examinationId);
            return StandardResponse.success(result);
        } catch (RuntimeException e) {
            return StandardResponse.error(e.getMessage());
        }
    }

    @PutMapping("/change-time-slot")
    public ExamTimeTableDTO changeTimeSlotAfterApproval(@RequestBody TimeSlotChangeRequestDTO requestDTO) {
        return examTimeTableService.changeTimeSlotAfterApproval(requestDTO);
    }

    @PostMapping("/slot/approve/{examTimeTableId}")
    public StandardResponse  approveExamTimeTableById(@PathVariable Long examTimeTableId) {
        try {
            String result = examTimeTableService.approveExamTimeTableById(examTimeTableId);
            return StandardResponse.success(result);
        } catch (RuntimeException e) {
            return StandardResponse.error(e.getMessage());
        }
    }

    @GetMapping("/paper/exists")
    public ResponseEntity<Map<String, Boolean>> checkPaperExists(
            @RequestParam Long courseId,
            @RequestParam Long examinationId,
            @RequestParam String paperType) {

        PaperType type;
        try {
            type = PaperType.valueOf(paperType);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        boolean exists = encryptedPaperRepository.existsByCourseIdAndExaminationIdAndPaperType(
                courseId, examinationId, type);

        return ResponseEntity.ok(Collections.singletonMap("exists", exists));
    }

    @GetMapping("/revisions/{examinationId}")
    public List<TimeSlotChangeLogDTO> getChangeLogs(@PathVariable Long examinationId) {
        return timeSlotChangeLogService.getChangeLogsByExaminationId(examinationId);
    }

    @PostMapping("/revisions/all")
    public List<TimeSlotChangeLogDTO> getChangeLogsByExaminationIds(@RequestBody List<Long> examinationIds) {
        return timeSlotChangeLogService.getChangeLogsByExaminationIds(examinationIds);
    }
}