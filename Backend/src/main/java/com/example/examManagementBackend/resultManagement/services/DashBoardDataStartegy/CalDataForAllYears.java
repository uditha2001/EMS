package com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy;

import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import com.example.examManagementBackend.resultManagement.services.GradingService;


import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class CalDataForAllYears implements DashBoardDataCalStartegy {
    @Override
    public DashboardPublishedResultsDTO calculateDashboardData(List<DataForCalCulationDTO> dataForCalCulationDTO) {
        Map<String, Float> marksAverage = new LinkedHashMap<>();
        Map<String, Integer> yearEntryCount = new HashMap<>();
        Map<String, Integer> gradeCount = new LinkedHashMap<>();

        Map<String, Float> totalMarksPerYear = new HashMap<>(); // year -> total marks

        for (DataForCalCulationDTO data : dataForCalCulationDTO) {
            String grade = data.getGrade();
            String year = String.valueOf(data.getPublishedAt().getYear());
            float marks = data.getMarks();

            calculateGradeCount(gradeCount, grade);

            totalMarksPerYear.put(year,
                    totalMarksPerYear.getOrDefault(year, 0f) + marks);

            yearEntryCount.put(year,
                    yearEntryCount.getOrDefault(year, 0) + 1);
        }

        // Calculate average per year
        for (String year : totalMarksPerYear.keySet()) {
            float total = totalMarksPerYear.get(year);
            int count = yearEntryCount.get(year);
            float average = total / count;
            marksAverage.put(year, average);
        }

        DashboardPublishedResultsDTO dashboardPublishedResultsDTO = new DashboardPublishedResultsDTO();
        dashboardPublishedResultsDTO.setMarksAverage(marksAverage);
        dashboardPublishedResultsDTO.setGradeCount(gradeCount);
        dashboardPublishedResultsDTO.setXAxisName("years");
        dashboardPublishedResultsDTO.setYAxisName("AverageMarks");

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
