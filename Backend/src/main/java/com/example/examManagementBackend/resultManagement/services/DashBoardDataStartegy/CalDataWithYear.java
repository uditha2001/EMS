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
        for (DataForCalCulationDTO data : dataForCalCulationDTO) {
            String grade = data.getGrade();
            String courseCode=data.getCourseCode();
            calculateGradeCount(gradeCount, grade);
            marksAverage.put(data.getCourseCode(), marksAverage.getOrDefault(data.getCourseCode(), 0f) + data.getMarks());
            courseEntryCount.put(courseCode,
                    courseEntryCount.getOrDefault(courseCode, 0) + 1);
        }
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
