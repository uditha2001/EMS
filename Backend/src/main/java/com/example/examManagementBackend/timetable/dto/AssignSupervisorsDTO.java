package com.example.examManagementBackend.timetable.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignSupervisorsDTO {
    private List<SupervisorAssignmentDTO> assignments;
}

