package com.example.examManagementBackend.examManagement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Table(name="exam_centers")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExamCentersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String examCenterName;
    @Column(columnDefinition = "TEXT")
    private String examCenterLocation;
    private Integer examCenterCapacity;
    private String contactPerson;


}
