package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String courseCode;

    @Column(nullable = false)
    private String courseName;

    @Column(columnDefinition = "TEXT")
    private String courseDescription;

    @Column
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "degree_program_id", nullable = false)
    private DegreeProgramEntity degreeProgram;

    public CourseEntity() {
    }

    public CourseEntity(String name, String courseCode, String courseDescription) {
        this.courseName = name;
        this.courseCode = courseCode;
        this.courseDescription = courseDescription;
    }

    public String getCourseName() {

        return courseName;
    }

    public void setCourseName(String CourseName) {

        this.courseName = CourseName;
    }

    public String getcourseDescription() {

        return courseDescription;
    }

    public void setcourseDescription(String courseDescription) {

        this.courseDescription = courseDescription;
    }

    public String getcourseCode() {

        return courseCode;
    }

    public  void setcourseCode(String courseCode){
        this.courseCode=courseCode;
    }


    public void setId(Long id) {
    }
}
