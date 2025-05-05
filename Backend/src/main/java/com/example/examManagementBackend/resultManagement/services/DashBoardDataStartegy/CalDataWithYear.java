package com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy;

import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;


import java.util.*;
public class CalDataWithYear implements DashBoardDataCalStartegy {
    @Override
    public DashboardPublishedResultsDTO calculateDashboardData(List<DataForCalCulationDTO> dataForCalCulationDTO) {
        Map<String,Float> marksAverage=new LinkedHashMap<>();
        Map<String,Integer> gradeCount=new LinkedHashMap<>();
        Map<String, Integer> courseEntryCount = new HashMap<>();
        dataForCalCulationDTO.stream().forEach(data -> {
            String grade = data.getGrade().replaceAll("\\s+$", "");
            String courseCode = data.getCourseCode();
            float marks = data.getMarks();

            gradeCount.merge(grade, 1, Integer::sum);
            marksAverage.merge(courseCode, marks, Float::sum);
            courseEntryCount.merge(courseCode, 1, Integer::sum);
        });
        for(String courseCode:marksAverage.keySet()){
            float total = marksAverage.get(courseCode);
            int count = courseEntryCount.get(courseCode);
            Float average = total / count;
            marksAverage.put(courseCode, average);
        }
       DashboardPublishedResultsDTO dashboardPublishedResultsDTO = new DashboardPublishedResultsDTO();
        dashboardPublishedResultsDTO.setMarksAverage(marksAverage);
        dashboardPublishedResultsDTO.setGradeCount(gradeCount);
        dashboardPublishedResultsDTO.setXAxisName("courses");
        dashboardPublishedResultsDTO.setYAxisName("AverageMarks");

        return dashboardPublishedResultsDTO;



    }

}
