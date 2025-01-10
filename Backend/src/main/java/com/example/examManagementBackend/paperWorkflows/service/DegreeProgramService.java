package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramsEntity;
import com.example.examManagementBackend.paperWorkflows.repo.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class DegreeProgramService {

    @Autowired
    DegreeProgramRepo repo;

    public List<DegreeProgramsEntity> getAllDegreePrograms(){
        List<DegreeProgramsEntity> degreeProgramList = repo.findAll();
        return  degreeProgramList;
    }

    public DegreeProgramsEntity saveDegreeProgram(DegreeProgramDTO dto){
        DegreeProgramsEntity entity = new DegreeProgramsEntity();
        entity.setDegreeName(dto.getName());
        entity.setDegreeDescription(dto.getDescription());

        return repo.save(entity);
    }

    public DegreeProgramsEntity getOneDegreeProgram(int id){
        DegreeProgramsEntity entity = repo.findById(id).orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));
        return entity;
    }

    public DegreeProgramsEntity updateDegreeProgram(DegreeProgramDTO dto, int id){

        DegreeProgramsEntity existingProgram = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));

        existingProgram.setDegreeName(dto.getName());
        existingProgram.setDegreeDescription(dto.getDescription());
        existingProgram.setUpdatedAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());

        return repo.save(existingProgram);
    }

    public void deleteDegreeProgram(int id) {
        DegreeProgramsEntity existingProgram = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));

        repo.delete(existingProgram);
    }

}
