package com.example.examManagementBackend.examManagement.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

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
    private String examCenterLocation;
    private Integer examCenterCapacity;
    @CreatedDate
    @Column(updatable = false,columnDefinition = "DATETIME",nullable = false)
    private Date createdAt;
    @LastModifiedDate
    @Column(columnDefinition = "DATETIME")
    private Date updatedAt;

}
