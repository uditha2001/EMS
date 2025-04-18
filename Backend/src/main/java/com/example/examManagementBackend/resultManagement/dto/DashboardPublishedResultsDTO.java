package com.example.examManagementBackend.resultManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DashboardPublishedResultsDTO {
    private Map<String,Float> marksAverage;
    private Map<String,Integer> gradeCount;
    private String yAxisName;
    private String xAxisName;

}
