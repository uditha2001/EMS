package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GradingService {
    private final CourseEvaluationRepo courseEvaluationRepo;
    private final ExamTypeRepo examTypeRepo;
    private final CoursesRepository coursesRepository;
    public GradingService(CourseEvaluationRepo courseEvaluationRepo, ExamTypeRepo examTypeRepo, CoursesRepository coursesRepository) {
        this.courseEvaluationRepo = courseEvaluationRepo;
        this.examTypeRepo = examTypeRepo;
        this.coursesRepository = coursesRepository;
    }

    /*
    used to get marks require to pass each exams types and marks percentage which get from
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

    /*
    save changed grades marks
    */
    public ResponseEntity<StandardResponse> saveChangedGradings(List<MarksPercentageDTO> marksPercentageDTOs){
        try{
            if(!marksPercentageDTOs.isEmpty()){
                for(MarksPercentageDTO marksPercentageDTO:marksPercentageDTOs){
                    if(courseEvaluationRepo.countByCourseCodeAndExamType(marksPercentageDTO.getCourseCode(),marksPercentageDTO.getExamType())>0){
                        courseEvaluationRepo.updateByCourseCodeAndExamType(marksPercentageDTO.getPassMark(),marksPercentageDTO.getWeightage(),marksPercentageDTO.getCourseCode(),marksPercentageDTO.getExamType());

                    }
                    else if(courseEvaluationRepo.countByCourseCodeAndExamType(marksPercentageDTO.getCourseCode(),marksPercentageDTO.getExamType())==0){
                        ExamTypesEntity examTypesEntity=examTypeRepo.getExamTypeByName(marksPercentageDTO.getExamType());
                        CoursesEntity coursesEntity=coursesRepository.findByCourseCode(marksPercentageDTO.getCourseCode());
                        if(examTypesEntity!=null && coursesEntity!=null){
                            CourseEvaluationsEntity courseEvaluationsEntity=new CourseEvaluationsEntity();
                            courseEvaluationsEntity.setPassMark(marksPercentageDTO.getPassMark());
                            courseEvaluationsEntity.setWeightage(marksPercentageDTO.getWeightage());
                            courseEvaluationsEntity.setCourses(coursesEntity);
                            courseEvaluationsEntity.setExamTypes(examTypesEntity);
                            courseEvaluationRepo.save(courseEvaluationsEntity);
                        }
                        else{
                            return new ResponseEntity<StandardResponse>(
                                    new StandardResponse(500,"failed",null), HttpStatus.INTERNAL_SERVER_ERROR
                            );
                        }

                    }
                }
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(200,"sucess",null), HttpStatus.OK
                );
            }
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );

        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    };
}
