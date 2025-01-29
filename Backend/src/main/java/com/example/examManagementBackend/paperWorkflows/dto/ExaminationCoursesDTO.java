package com.example.examManagementBackend.paperWorkflows.dto;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExaminationCoursesDTO {

    private Long id;
    private Long degreeId;
    private String degreeName;
    private List<ActiveCourseDTO> activeCourses;

    @Data
    @AllArgsConstructor
    public static class ActiveCourseDTO {
        private Long id;
        private String code;
        private String name;
        private CoursesEntity.CourseType courseType;
    }
}
