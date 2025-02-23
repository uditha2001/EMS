package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.resultManagement.repo.ExamCenterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExamCenterService {
    @Autowired
    ExamCenterRepo repo;


}
