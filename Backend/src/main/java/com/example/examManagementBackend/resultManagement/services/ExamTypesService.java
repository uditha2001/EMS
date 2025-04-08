package com.example.examManagementBackend.resultManagement.services;
import com.example.examManagementBackend.resultManagement.dto.ExamTypesDTO;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExamTypesService {
    private final ExamTypeRepo examTypesRepository;
    public ExamTypesService(ExamTypeRepo examTypesRepository) {
        this.examTypesRepository = examTypesRepository;
    }
    public ResponseEntity<StandardResponse> getAllExamTypes() {
        try{
            List<ExamTypesEntity> examTypes=examTypesRepository.getExamTypes();
            List<ExamTypesDTO> examTypesDTOList=new ArrayList<>();
            for(ExamTypesEntity examType:examTypes){
                ExamTypesDTO examTypesDTO=new ExamTypesDTO();
                examTypesDTO.setId(examType.getId());
                examTypesDTO.setName(examType.getExamType());
                examTypesDTOList.add(examTypesDTO);
            }

            return new ResponseEntity<>(
                    new StandardResponse(200,"sucess",examTypesDTOList),HttpStatus.OK
            );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"exam type fetch is failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> getExamTypeById(Long id) {
        try{
            List<ExamTypesEntity> examTypes=examTypesRepository.getExamTypesById(id);
            List<ExamTypesDTO> examTypesDTOList=new ArrayList<>();
            for(ExamTypesEntity examType:examTypes){
                ExamTypesDTO examTypesDTO=new ExamTypesDTO();
                examTypesDTO.setId(examType.getId());
                examTypesDTO.setName(examType.getExamType());
                examTypesDTOList.add(examTypesDTO);

            }
            return new ResponseEntity<>(
                    new StandardResponse(200,"sucess",examTypesDTOList),HttpStatus.OK
            );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"exam type fetch is failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> addExamType(String examType) {
        try{
            ExamTypesEntity examTypesEntity=new ExamTypesEntity();
            examTypesEntity.setExamType(examType);
            examTypesRepository.save(examTypesEntity);
            return new ResponseEntity<>(
                    new StandardResponse(200,"sucess",null),HttpStatus.OK
            );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                   new StandardResponse(500,"failed to add exam type",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> deleteExamTypeById(Long id) {
        try{
                examTypesRepository.deleteExamTypeById(id);
                return new ResponseEntity<>(
                        new StandardResponse(200,"sucess",null),HttpStatus.OK
                );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"failed to delete exam type",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> updateExamType(String examType,Long id) {
        try{
            examTypesRepository.updateExamTypeById(id, examType);
            return new ResponseEntity<>(
                    new StandardResponse(200,"sucess",null),HttpStatus.OK
            );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"failed to update exam type",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
