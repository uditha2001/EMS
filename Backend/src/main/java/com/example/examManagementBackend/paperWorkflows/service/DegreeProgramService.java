package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.DegreeProgramDTO;
import com.example.examManagementBackend.paperWorkflows.entity.DegreeProgramEntity;
import com.example.examManagementBackend.paperWorkflows.repo.DegreeProgramRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DegreeProgramService {

    @Autowired
    DegreeProgramRepo repo;

    public List<DegreeProgramEntity> getAllDegreePrograms(){
        List<DegreeProgramEntity> degreeProgramList = repo.findAll();
        return  degreeProgramList;
    }

    public DegreeProgramEntity saveDegreeProgram(DegreeProgramDTO dto){
        DegreeProgramEntity entity = new DegreeProgramEntity();
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());

        return repo.save(entity);
    }

    public DegreeProgramEntity getOneDegreeProgram(int id){
        DegreeProgramEntity entity = repo.findById(id).orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));
        return entity;
    }

    public DegreeProgramEntity updateDegreeProgram(DegreeProgramDTO dto, int id){

        DegreeProgramEntity existingProgram = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));

        existingProgram.setName(dto.getName());
        existingProgram.setDescription(dto.getDescription());
        existingProgram.setUpdatedAt(new java.sql.Timestamp(System.currentTimeMillis()));

        return repo.save(existingProgram);
    }

    public void deleteDegreeProgram(int id) {
        DegreeProgramEntity existingProgram = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Degree Program not found with id: " + id));

        repo.delete(existingProgram);
    }

}
