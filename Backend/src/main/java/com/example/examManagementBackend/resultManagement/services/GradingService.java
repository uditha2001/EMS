package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.resultManagement.dto.GradeDetailsDTO;
import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.entities.CourseEvaluationsEntity;
import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class GradingService {
    private final CourseEvaluationRepo courseEvaluationRepo;
    private final ExamTypeRepo examTypeRepo;
    private final CoursesRepository coursesRepository;
    private final ResultRepo resultRepo;
    public GradingService(CourseEvaluationRepo courseEvaluationRepo, ExamTypeRepo examTypeRepo, CoursesRepository coursesRepository, ResultRepo resultRepo) {
        this.courseEvaluationRepo = courseEvaluationRepo;
        this.examTypeRepo = examTypeRepo;
        this.coursesRepository = coursesRepository;
        this.resultRepo = resultRepo;
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

    //used to getStudents marks Grades
    public ResponseEntity<StandardResponse> getGradingsMark(String courseCode,Long examinationId){
        try{

            LinkedHashMap<ExamTypesName,float[]> examtypesMarks=new LinkedHashMap<>();
            List<ResultEntity> StudentResults=resultRepo.getStudentResultsByCourseCodeAndExamId(courseCode,examinationId, ResultStatus.SECOND_MARKING_COMPLETE);
            Set<GradeDetailsDTO> gradeDetailsDTOS=new LinkedHashSet<>();
            List<ExamTypesName> examTypeNames=resultRepo.getExamTypeName(courseCode,examinationId,ResultStatus.SECOND_MARKING_COMPLETE);
            for(ExamTypesName name:examTypeNames){
                float[] marksConditions=getExamTypesMarksConditions(courseCode,name);
                examtypesMarks.put(name,marksConditions);
            }
            Map<String, Map<ExamTypesName, Float>> marksData=storeStudentDataWithexamTypeIdAndStudentNumber(StudentResults);
            saveCalculatedMarksValues(marksData,examtypesMarks);
            for(ResultEntity resultEntity:StudentResults){
                GradeDetailsDTO gradeDetailsDTO=new GradeDetailsDTO();
                float totalMarks=calculateTotalMarks(marksData,resultEntity);
                String Grade=gradeTheMarks(totalMarks);
                Map<ExamTypesName,Float> examTypesName=marksData.get(resultEntity.getStudent().getStudentNumber());
                gradeDetailsDTO.setStudentNumber(resultEntity.getStudent().getStudentNumber());
                gradeDetailsDTO.setStudentName(resultEntity.getStudent().getStudentName());
                gradeDetailsDTO.setTotalMarks(totalMarks);
                gradeDetailsDTO.setGrade(Grade);
                gradeDetailsDTO.setExamTypesName(examTypesName);
                gradeDetailsDTOS.add(gradeDetailsDTO);
            }
            return  new ResponseEntity<>(
                    new StandardResponse(200, "sucess", gradeDetailsDTOS), HttpStatus.OK
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(404, "failed", null), HttpStatus.NOT_FOUND
            );
        }
    }

    //used to store students marks with their scNumber and examTypeId
    private  Map<String, Map<ExamTypesName, Float>>  storeStudentDataWithexamTypeIdAndStudentNumber(List<ResultEntity> results){
        Map<String, Map<ExamTypesName, Float>> marksData = new HashMap<>();
        for(ResultEntity resultEntity:results){
            marksData.putIfAbsent(resultEntity.getStudent().getStudentNumber(), new HashMap<>());
            marksData.get(resultEntity.getStudent().getStudentNumber()).put(resultEntity.getExamType().getName(),resultEntity.getSecondMarking());
        }
        return marksData;
    }

    //used to calculate the marks values for each exam type using stored map
    private void saveCalculatedMarksValues(Map<String, Map<ExamTypesName, Float>> marksData,LinkedHashMap<ExamTypesName,float[]> examtypesMarks){
        examtypesMarks.forEach((examTypeID, examMarks) -> {
            marksData.forEach((studentNumber, studentMarks) -> {
                if (studentMarks.containsKey(examTypeID)) {
                    float marks=studentMarks.get(examTypeID);
                    if(marks>=examMarks[0]){
                        marks= (float) Math.round((marks * (examMarks[1] / 100)));
                        studentMarks.put(examTypeID,marks);
                    }
                    else{
                        studentMarks.put(examTypeID,0f);
                    }
                }
            });
        });
    }

    //calculate total marks
    private float calculateTotalMarks(Map<String, Map<ExamTypesName, Float>> marksData,ResultEntity resultEntity){
        float totalMarks = 0;
        if (marksData.containsKey(resultEntity.getStudent().getStudentNumber())) {
            Map<ExamTypesName, Float> studentMarks = marksData.get(resultEntity.getStudent().getStudentNumber());

            for (Map.Entry<ExamTypesName, Float> entry : studentMarks.entrySet()) {
                Float marks = entry.getValue();
                totalMarks += marks;
            }

        }
        return totalMarks ;
    }

    //calculating gradings
    private String gradeTheMarks(float totalMarks){
        if(85<=totalMarks && totalMarks<=100){
            return "A+";
        } else if (70<=totalMarks && totalMarks<=84) {
            return "A ";
        }else if (65<=totalMarks && totalMarks<=69) {
            return "A-";
        }else if (60<=totalMarks && totalMarks<=64) {
            return "B+";
        }else if (55<=totalMarks && totalMarks<=59) {
            return "B ";
        }else if (50<=totalMarks && totalMarks<=54) {
            return "B-";
        }else if (45<=totalMarks && totalMarks<=49) {
            return "C+";
        }else if (40<=totalMarks && totalMarks<=44) {
            return "C ";
        }else if (35<=totalMarks && totalMarks<=39) {
            return "C-";
        }else if (30<=totalMarks && totalMarks<=34) {
            return "D+";
        }else if (25<=totalMarks && totalMarks<=29) {
            return "D ";
        }
        else{
            return "E ";
        }
    }

    //used to get students calculated marks from each type
    private float[] getExamTypesMarksConditions(String courseCode,ExamTypesName examTypeName){
            if(courseEvaluationRepo.countByCourseCodeAndExamType(courseCode,examTypeName)>0){
                final float passMarks=courseEvaluationRepo.getPassMarkByCourseCodeAndCourseEvaluationId(courseCode,examTypeName);
                final float weightage=courseEvaluationRepo.getWeightageByCourseCodeAndCourseEvaluationId(courseCode,examTypeName);
                return new float[]{passMarks,weightage};
            }
           return new float[]{0,0};
        }
    private LinkedHashMap<ExamTypesName,Float> getTakenMarksFromEachExamTypes(LinkedHashMap<Long,float[]> examtypesMarks,ResultEntity resultEntity){
        return null;
    }
}
