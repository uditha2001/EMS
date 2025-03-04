package com.example.examManagementBackend.timetable.controllers;

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

    @PostMapping("/assign-center/{examTimeTableId}/{centerId}")
    public StandardResponse assignExamCenter(@PathVariable Long examTimeTableId, @PathVariable Long centerId) {
        return StandardResponse.success(examTimeTableService.assignExamCenter(examTimeTableId, centerId));
    }

    @PostMapping("/assign-invigilator/{examTimeTableId}/{invigilatorId}")
    public StandardResponse assignInvigilator(@PathVariable Long examTimeTableId, @PathVariable Long invigilatorId) {
        return StandardResponse.success(examTimeTableService.assignInvigilator(examTimeTableId, invigilatorId));
    }

    @PostMapping("/assign-supervisor/{examTimeTableId}/{supervisorId}")
    public StandardResponse assignSupervisor(@PathVariable Long examTimeTableId, @PathVariable Long supervisorId) {
        return StandardResponse.success(examTimeTableService.assignSupervisor(examTimeTableId, supervisorId));
    }

}