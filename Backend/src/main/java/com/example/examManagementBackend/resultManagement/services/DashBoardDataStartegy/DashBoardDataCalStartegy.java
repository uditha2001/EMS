package com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy;

import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;

import java.util.List;

public interface DashBoardDataCalStartegy {
    public DashboardPublishedResultsDTO calculateDashboardData(List<DataForCalCulationDTO> dataForCalCulationDTO);
}
