package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GradingService {
    private final CourseEvaluationRepo courseEvaluationRepo;
    public GradingService(CourseEvaluationRepo courseEvaluationRepo) {
        this.courseEvaluationRepo = courseEvaluationRepo;
    }

    /*
    used to get marks require to pass the each exams types and marks percentage which get from
    each exams type to calculate final marks
    */
    public ResponseEntity<StandardResponse> getRequiredPercentagesAndPassMark(String courseCode){
    try{
        List<CourseEvaluationsEntity> courseEvaluationsEntities=courseEvaluationRepo.getAllByCourseCode(courseCode);
        List<MarksPercentageDTO> marksPercentageDTOS=new ArrayList<>();
        for(CourseEvaluationsEntity courseEvaluationsEntity:courseEvaluationsEntities){
            MarksPercentageDTO marksPercentageDTO=new MarksPercentageDTO();
            marksPercentageDTO.setExamType(courseEvaluationsEntity.getExamTypes().getName());
            marksPercentageDTO.setPassMark(courseEvaluationsEntity.getPassMark());
            marksPercentageDTO.setWeightage(courseEvaluationsEntity.getWeightage());
            marksPercentageDTOS.add(marksPercentageDTO);
        }
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"sucess",marksPercentageDTOS),HttpStatus.OK
        );
    }
    catch(Exception e){
        e.printStackTrace();
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(500,"failed",null), HttpStatus.INTERNAL_SERVER_ERROR
        );
        }
    }
}
