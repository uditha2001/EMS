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
import java.util.List;
import java.util.stream.Collectors;

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
        List<MarksPercentageDTO> marksPercentageDTOS = courseEvaluationRepo.getAllByCourseCode(courseCode)
                .stream()
                .map(courseEvaluationsEntity -> {
                    MarksPercentageDTO dto = new MarksPercentageDTO();
                    dto.setExamType(courseEvaluationsEntity.getExamTypes().getName());
                    dto.setPassMark(courseEvaluationsEntity.getPassMark());
                    dto.setWeightage(courseEvaluationsEntity.getWeightage());
                    return dto;
                })
                .collect(Collectors.toList());
        return new ResponseEntity<>(
                new StandardResponse(200, "sucess", marksPercentageDTOS), HttpStatus.OK
        );
    }
    catch(Exception e){
        e.printStackTrace();
        return new ResponseEntity<>(
                new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
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
                        courseEvaluationRepo.updateByCourseCodeANdExamType(marksPercentageDTO.getPassMark(),marksPercentageDTO.getWeightage(),marksPercentageDTO.getCourseCode(),marksPercentageDTO.getExamType());

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
                            return new ResponseEntity<>(
                                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
                            );
                        }

                    }
                }
                return new ResponseEntity<>(
                        new StandardResponse(200, "sucess", null), HttpStatus.OK
                );
            }
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );

        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
