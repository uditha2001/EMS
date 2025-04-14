package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.Notification.NotificationDTO.NotificationDTO;
import com.example.examManagementBackend.Notification.NotificationService.NotificationService;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.resultManagement.dto.GradeDetailsDTO;
import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.entities.*;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class GradingService {
    private final CourseEvaluationRepo courseEvaluationRepo;
    private final ExamTypeRepo examTypeRepo;
    private final CoursesRepository coursesRepository;
    private final ResultRepo resultRepo;
    private final NotificationService notificationService;
    public GradingService(CourseEvaluationRepo courseEvaluationRepo, ExamTypeRepo examTypeRepo, CoursesRepository coursesRepository, ResultRepo resultRepo, NotificationService notificationService) {
        this.courseEvaluationRepo = courseEvaluationRepo;
        this.examTypeRepo = examTypeRepo;
        this.coursesRepository = coursesRepository;
        this.resultRepo = resultRepo;
        this.notificationService = notificationService;
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
            marksPercentageDTO.setExamType(courseEvaluationsEntity.getExamTypes().getExamType());
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
            LinkedHashMap<String,float[]> examtypesMarks=new LinkedHashMap<>();
            Map<String,Integer> gradeCount=new HashMap<>();
            Set<StudentsEntity> studentNumbers=new HashSet<>();
            List<ResultStatus> statuses = Arrays.asList(ResultStatus.SECOND_MARKING_COMPLETE, ResultStatus.MEDICAL, ResultStatus.ABSENT);
            List<ResultEntity> studentResults = resultRepo.getStudentResultsByCourseCodeAndExamId(courseCode, examinationId, statuses);
            Set<GradeDetailsDTO> gradeDetailsDTOS=new LinkedHashSet<>();
            List<String> examTypeNames=resultRepo.getExamTypeName(courseCode,examinationId,ResultStatus.SECOND_MARKING_COMPLETE);
            if(!studentResults.isEmpty() && !examTypeNames.isEmpty()){
                String Grade;
                for(String name:examTypeNames){
                    float[] marksConditions=getExamTypesMarksConditions(courseCode,name);
                    examtypesMarks.put(name,marksConditions);
                }
                Map<String, Map<String, Float>> marksData=storeStudentDataWithExamTypeIdAndStudentNumber(studentResults);
                saveCalculatedMarksValues(marksData,examtypesMarks);
                extractStudent(studentNumbers,studentResults);
                for(StudentsEntity student:studentNumbers){
                    GradeDetailsDTO gradeDetailsDTO=new GradeDetailsDTO();
                    float totalMarks=calculateTotalMarks(marksData,student.getStudentNumber());
                    if(totalMarks==-1){
                        gradeDetailsDTO.setGrade("ABSENT");
                        calculateGradeCount(gradeCount,"ABSENT ");

                    }
                    else if(totalMarks==-2){
                        gradeDetailsDTO.setGrade("MEDICAL");
                        calculateGradeCount(gradeCount,"MEDICAL ");

                    }
                    else{
                        Grade=gradeTheMarks(totalMarks);
                        calculateGradeCount(gradeCount,Grade);
                        gradeDetailsDTO.setGrade(Grade);
                    }
                    Map<String,Float> examTypesName=marksData.get(student.getStudentNumber());
                    gradeDetailsDTO.setStudentNumber(student.getStudentNumber());
                    gradeDetailsDTO.setStudentName(student.getStudentName());
                    gradeDetailsDTO.setTotalMarks(totalMarks);
                    gradeDetailsDTO.setExamTypesName(examTypesName);
                    gradeDetailsDTOS.add(gradeDetailsDTO);
                }


                Object[] responseData = new Object[]{gradeDetailsDTOS, gradeCount};
                return  new ResponseEntity<>(
                        new StandardResponse(200, "sucess", responseData), HttpStatus.OK
                );
            }
            else{
                return new ResponseEntity<>(
                        new StandardResponse(422, "already published!", null), HttpStatus.UNPROCESSABLE_ENTITY
                );
            }

        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(404, "failed", null), HttpStatus.NOT_FOUND
            );
        }
    }

    //used to store students marks with their scNumber and examTypeId
    private  Map<String, Map<String, Float>>  storeStudentDataWithExamTypeIdAndStudentNumber(List<ResultEntity> results){
        Map<String, Map<String, Float>> marksData = new HashMap<>();
        for(ResultEntity resultEntity:results){
            marksData.putIfAbsent(resultEntity.getStudent().getStudentNumber(), new HashMap<>());
            marksData.get(resultEntity.getStudent().getStudentNumber()).put(resultEntity.getExamType().getExamType(), resultEntity.getSecondMarking());
        }
        return marksData;
    }

    //used to calculate the marks values for each exam type using stored map
    private void saveCalculatedMarksValues(Map<String, Map<String, Float>> marksData,LinkedHashMap<String,float[]> examtypesMarks){
        examtypesMarks.forEach((examTypeID, examMarks) -> {
            marksData.forEach((studentNumber, studentMarks) -> {
                if (studentMarks.containsKey(examTypeID)) {
                    float marks=studentMarks.get(examTypeID);
                    if(marks>=examMarks[0]){
                        marks= (float) Math.round((marks * (examMarks[1] / 100)));
                        studentMarks.put(examTypeID,marks);
                    }
                    else if(marks==-1){
                        studentMarks.put(examTypeID,-1f);
                    }
                    else if(marks==-2){
                        studentMarks.put(examTypeID,-2f);
                    }
                    else{
                        studentMarks.put(examTypeID,0f);
                    }
                }
            });
        });
    }

    //calculate total marks
    private float calculateTotalMarks(Map<String, Map<String, Float>> marksData,String studentNumber){
        float totalMarks = 0;
        if (marksData.containsKey(studentNumber)) {
            Map<String, Float> studentMarks = marksData.get(studentNumber);

            for (Map.Entry<String, Float> entry : studentMarks.entrySet()) {

                Float marks = entry.getValue();
                if(marks!=-2 && marks !=-1){
                    totalMarks += marks;
                }
                else if(marks==-2){
                    totalMarks=-2;
                    return totalMarks;
                }
                else if(marks==-1){
                    totalMarks=-1;
                    return totalMarks;
                }
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
    private float[] getExamTypesMarksConditions(String courseCode,String examTypeName){
            if(courseEvaluationRepo.countByCourseCodeAndExamType(courseCode,examTypeName)>0){
                final float passMarks=courseEvaluationRepo.getPassMarkByCourseCodeAndCourseEvaluationId(courseCode,examTypeName);
                final float weightage=courseEvaluationRepo.getWeightageByCourseCodeAndCourseEvaluationId(courseCode,examTypeName);
                return new float[]{passMarks,weightage};
            }
           return new float[]{0,0};
        }
    private void calculateGradeCount(Map<String,Integer> gradeDetails,String grade){
        if(gradeDetails.containsKey(grade)){
            int value=gradeDetails.get(grade);
            value+=1;
            gradeDetails.put(grade,value);
        }
        else{
            gradeDetails.put(grade,1);
        }
    }

    private void extractStudent(Set<StudentsEntity>studentNumbers,List<ResultEntity> resultEntities){
                    for(ResultEntity resultEntity : resultEntities){
                        studentNumbers.add(resultEntity.getStudent());
                    }
    }


}
