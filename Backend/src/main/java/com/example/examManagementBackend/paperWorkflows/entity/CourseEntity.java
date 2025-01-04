package com.example.examManagementBackend.paperWorkflows.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.List;


    @Entity
    @Table(name="Course")
    public class CourseEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private String courseCode;
        @Column(nullable = false,unique = true)
        private String courseName;
        @Column
        private String description;
        @ElementCollection
        private List<String> DegreeProgram;

//        @OneToMany(mappedBy = "courseEntity", cascade = CascadeType.ALL, orphanRemoval = true)
//        private Set<DegreeProgramEntity> DegreePrograms;


        public CourseEntity() {
        }

        public CourseEntity(String courseCode, String courseName, String Description , List<String> DegreeProgram ) {
            this.courseCode = courseCode;
            this.courseName = courseName;
            this.description = Description;
            this.DegreeProgram = DegreeProgram;
        }

        public String getcourseName() {

            return courseName;
        }

        public void setcourseName(String courseName) {

            this.courseName = courseName;
        }

        public String getdescription() {

            return description;
        }

        public void setdescription(String description) {

            this.description = description;
        }

        public String getcourseCode() {

            return courseCode;
        }


    }

