package com.example.examManagementBackend.timetable.services;

import com.example.examManagementBackend.timetable.dto.TimeSlotChangeLogDTO;
import com.example.examManagementBackend.timetable.entities.TimeSlotChangeLog;
import com.example.examManagementBackend.timetable.repository.TimeSlotChangeLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeSlotChangeLogService {
    private final TimeSlotChangeLogRepository timeSlotChangeLogRepository;

    public TimeSlotChangeLogService(TimeSlotChangeLogRepository timeSlotChangeLogRepository) {
        this.timeSlotChangeLogRepository = timeSlotChangeLogRepository;
    }

    public List<TimeSlotChangeLogDTO> getChangeLogsByExaminationId(Long examinationId) {
        List<TimeSlotChangeLog> changeLogs = timeSlotChangeLogRepository.findByExamTimeTable_Examination_Id(examinationId);

        return getTimeSlotChangeLogDTOS(changeLogs);
    }

    public List<TimeSlotChangeLogDTO> getChangeLogsByExaminationIds(List<Long> examinationIds) {
        // Fetch change logs for all provided examinationIds
        List<TimeSlotChangeLog> changeLogs = timeSlotChangeLogRepository.findByExamTimeTable_Examination_IdIn(examinationIds);

        return getTimeSlotChangeLogDTOS(changeLogs);
    }

    private List<TimeSlotChangeLogDTO> getTimeSlotChangeLogDTOS(List<TimeSlotChangeLog> changeLogs) {
        return changeLogs.stream().map(log -> {
            TimeSlotChangeLogDTO dto = new TimeSlotChangeLogDTO();
            dto.setId(log.getId());
            dto.setPreviousDate(log.getPreviousDate());
            dto.setPreviousStartTime(log.getPreviousStartTime());
            dto.setPreviousEndTime(log.getPreviousEndTime());
            dto.setNewDate(log.getNewDate());
            dto.setNewStartTime(log.getNewStartTime());
            dto.setNewEndTime(log.getNewEndTime());
            dto.setChangeReason(log.getChangeReason());
            dto.setChangeTimestamp(log.getChangeTimestamp());
            dto.setChangedBy(log.getChangedBy());
            dto.setCourseCode(log.getExamTimeTable().getCourse().getCode());
            dto.setPaperType(log.getExamTimeTable().getExamType().getExamType());
            dto.setExamTimeTableId(log.getExamTimeTable().getExamTimeTableId());
            return dto;
        }).collect(Collectors.toList());
    }
}
