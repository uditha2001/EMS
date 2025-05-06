package com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy;

import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;



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

        dataForCalCulationDTO.stream().forEach(data -> {
            String grade = data.getGrade().replaceAll("\\s+$", "");
            String year = String.valueOf(data.getPublishedAt().getYear());
            float marks = data.getMarks();

            gradeCount.merge(grade, 1, Integer::sum);
            totalMarksPerYear.merge(year, marks, Float::sum);
            yearEntryCount.merge(year, 1, Integer::sum);
        });


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

}
