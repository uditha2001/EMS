package com.example.examManagementBackend.timetable.controllers;

import com.example.examManagementBackend.timetable.dto.AllocateExamCentersDTO;
import com.example.examManagementBackend.timetable.dto.AssignInvigilatorsDTO;
import com.example.examManagementBackend.timetable.dto.AssignSupervisorsDTO;
import com.example.examManagementBackend.timetable.dto.ExamTimeTableDTO;
import com.example.examManagementBackend.timetable.services.ExamTimeTablesService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exam-time-table")
public class ExamTimeTablesController {

    private final ExamTimeTablesService examTimeTableService;


    public ExamTimeTablesController(ExamTimeTablesService examTimeTableService) {
        this.examTimeTableService = examTimeTableService;
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

    @GetMapping("/all")
    public StandardResponse getAllExamTimeTables() {
        return StandardResponse.success(examTimeTableService.getAllExamTimeTables());
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



}