package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
//@NoArgsConstructor
@AllArgsConstructor
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String courseCode;

    @Column(nullable = false)
    private String CourseName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "degree_program_id", nullable = false)
    private DegreeProgramEntity degreeProgram;

    public CourseEntity() {
    }

    public CourseEntity(String name, String courseDescription) {
        this.CourseName = name;
        this.description = courseDescription;
    }

    public String getCourseName() {

        return CourseName;
    }

    public void setRoleName(String CourseName) {

        this.CourseName = CourseName;
    }

    public String getdescription() {

        return description;
    }

    public void setdescription(String courseDescription) {

        this.description = courseDescription;
    }

    public String getcourseCode() {

        return courseCode;
    }

}
