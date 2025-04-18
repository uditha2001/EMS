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
        for (DataForCalCulationDTO data : dataForCalCulationDTO) {
            String grade = data.getGrade().toUpperCase();
            calculateGradeCount(gradeCount, grade);
        }

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
        dashboardPublishedResultsDTO.setXAxisName("Grades");
        dashboardPublishedResultsDTO.setYAxisName("Average Ratio");

        return dashboardPublishedResultsDTO;
    }
    private void calculateGradeCount(Map<String,Integer> gradeDetails,String grade){
        if(gradeDetails.containsKey(grade)){
            int value=gradeDetails.get(grade);
            value+=1;
            gradeDetails.put(grade,value);
        }
        else{
            gradeDetails.put(grade,1);
        }
    }
}
