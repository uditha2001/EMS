package com.example.examManagementBackend.paperWorkflows.dto;


public class CourseDTO {
    private String courseCode;
    private String courseName;
    private String description;
    private String DegreeProgram;
    



    public CourseDTO(String courseCode, String courseName, String Description ,String DegreeProgram ) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = Description;
        this.DegreeProgram = DegreeProgram;
    }

    public String getcourseCode() {

        return courseCode;
    }

    public String getcourseName() {

        return courseName;
    }

    public void setcourseName(String roleName) {
        this.courseName = courseName;
    }

    public String getDescription() {

        return description;
    }

    public void setDescription(String description) {

        this.description = description;
    }

    public String getDegreeProgram() {

        return DegreeProgram;
    }

    public void SetDegreeProgram(String DegreeProgram) {

        this.DegreeProgram = DegreeProgram;    }


}