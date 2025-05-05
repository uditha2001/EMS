package com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy;

import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CalDataForaCourse implements DashBoardDataCalStartegy {
    @Override
    public DashboardPublishedResultsDTO calculateDashboardData(List<DataForCalCulationDTO> dataForCalCulationDTO) {
        int totalEntries = dataForCalCulationDTO.size();
        Map<String, Integer> gradeCount = new LinkedHashMap<>();
        Map<String, Float> averageGradeCount = new LinkedHashMap<>();
         dataForCalCulationDTO.stream().forEach(data->{
             String grade = data.getGrade().replaceAll("\\s+$", "");
             gradeCount.merge(grade, 1, Integer::sum);
         });

        // Calculate average (ratios) for each grade
        for (Map.Entry<String, Integer> entry : gradeCount.entrySet()) {
            String grade = entry.getKey();
            int count = entry.getValue();
            float average = (float) count / totalEntries;
            averageGradeCount.put(grade, average);
        }

        // Build response DTO
        DashboardPublishedResultsDTO dashboardPublishedResultsDTO = new DashboardPublishedResultsDTO();
        dashboardPublishedResultsDTO.setMarksAverage(averageGradeCount);
        dashboardPublishedResultsDTO.setGradeCount(gradeCount);
        dashboardPublishedResultsDTO.setXAxisName("Grades");
        dashboardPublishedResultsDTO.setYAxisName("Average Ratio");

        return dashboardPublishedResultsDTO;
    }

}
