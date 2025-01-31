package com.example.examManagementBackend.examManagement.entities;

import com.example.examManagementBackend.examManagement.entities.Enums.ExamTypesName;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="exam_types")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamTypesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ExamTypesName name;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "examType")
    private List<ExamTimeTablesEntity> examTimeTables;


}
