package com.example.examManagementBackend.timetable.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignInvigilatorsDTO {
    private List<InvigilatorAssignmentDTO> assignments;
}

