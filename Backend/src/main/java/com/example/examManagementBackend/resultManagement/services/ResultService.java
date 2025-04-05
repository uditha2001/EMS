package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.resultManagement.dto.*;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.entities.PublishedAndReCorrectedResultsEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.resultManagement.entities.StudentsEntity;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.resultManagement.repo.PublishedResultsRepo;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.resultManagement.repo.StudentRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces.JwtService;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ResultService {
    private final StudentRepo studentRepo;
    private final ResultRepo resultRepo;
    private final ExaminationRepository examinationRepo;
    private final CoursesRepository coursesRepo;
    private final ExamTypeRepo examTypeRepo;
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;
    private final CoursesRepository coursesRepository;
    private final ExaminationRepository examinationRepository;
    private final PublishedResultsRepo publishedResultsRepo;

    public ResultService(StudentRepo studentRepo, ResultRepo resultRepo, ExaminationRepository examinationRepo, CoursesRepository coursesRepo, ExamTypeRepo examTypeRepo, JwtService jwtService, UserManagementRepo userManagementRepo, CoursesRepository coursesRepository,ExaminationRepository examinationRepository, PublishedResultsRepo publishedResultsRepo) {
        this.studentRepo = studentRepo;
        this.resultRepo = resultRepo;
        this.examinationRepo = examinationRepo;
        this.coursesRepo=coursesRepo;
        this.examTypeRepo=examTypeRepo;
        this.jwtService = jwtService;
        this.userManagementRepo = userManagementRepo;
        this.coursesRepository = coursesRepository;
        this.examinationRepository = examinationRepository;
        this.publishedResultsRepo = publishedResultsRepo;
    }
    public ResponseEntity<StandardResponse> saveMarkingResults(ResultDTO results, HttpServletRequest request){
        try{
            if(results.getExamName()!=null && results.getCourseCode()!=null && results.getStudentsData()!=null && !results.getStudentsData().isEmpty()) {
                Object[] data= jwtService.getUserNameAndToken(request);
                String username = data[0].toString();
                UserEntity approvedBy=userManagementRepo.findByUsername(username);
                Long courseId=getCourseCodeId(results.getCourseCode());
                Long examinationId=results.getId();
                Long examinationTypeId=getExaminationTypeId(results.getExamType());
                for(StudentDTO student: results.getStudentsData()){
                    Long studentId=getStudentsTableId(student.getStudentNumber());
                    saveStudentsDetails(student);
                    ResultEntity resultEntity = new ResultEntity();
                    if(resultRepo.isEmpty(examinationId,studentId,examinationTypeId,courseId)==0){
                        StudentsEntity studentsEntity=studentRepo.findByStudentNumber(student.getStudentNumber());
                        CoursesEntity  coursesEntity=coursesRepo.findByCourseId(courseId);
                        ExamTypesEntity examTypes=examTypeRepo.getUsingId(examinationTypeId);
                        ExaminationEntity examinationEntity=examinationRepo.findById(examinationId).orElse(null);
                        resultEntity.setStudent(studentsEntity);
                        resultEntity.setCourse(coursesEntity);
                        resultEntity.setExamType(examTypes);
                        resultEntity.setExamination(examinationEntity);
                        resultEntity.setFirstMarking(student.getFirstMarking());
                        resultEntity.setApprovedBy(approvedBy);
                        resultRepo.save(resultEntity);

                    }
                    else if(resultRepo.isEmpty(examinationId,studentId,examinationTypeId,courseId)>0){
                        Long resultId= resultRepo.getResultIdIfExists(examinationId,studentId,examinationTypeId,courseId);
                        if(student.getSecondMarking()!=null){
                            resultRepo.updateSecondMarkingResults(student.getSecondMarking(),approvedBy,resultId,ResultStatus.SECOND_MARKING_COMPLETE);

                        }
                        else{
                            resultRepo.updateFirstMarkingResults(student.getFirstMarking(),approvedBy,resultId,ResultStatus.FIRST_MARKING_COMPLETE);
                        }
                    }

                }
                return new ResponseEntity<>(
                        new StandardResponse(201, "sucess", null), HttpStatus.CREATED
                );
            }
            else{
                return new ResponseEntity<>(
                        new StandardResponse(500, "failed to save data", null), HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed to save data", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private Long getCourseCodeId(String code){
        return coursesRepo.getCourseIdByCode(code);
    }

    private Long getStudentsTableId(String studentNumber ){
        return studentRepo.getIdBystudentNumber(studentNumber);
    }

    private Long getExaminationTypeId(String examinationType){
            return examTypeRepo.getExamTypeIdByExamTypeName(examinationType);
    }

    public void saveStudentsDetails(StudentDTO student){
        if(studentRepo.IsEmpty(student.getStudentNumber())==0){
            StudentsEntity studentsEntity=new StudentsEntity();
            studentsEntity.setStudentName(student.getStudentName());
            studentsEntity.setStudentNumber(student.getStudentNumber());
            studentRepo.save(studentsEntity);
        }
        else{
            studentRepo.updateStudentName(student.getStudentNumber(),student.getStudentName());
        }
    }

    public ResponseEntity<StandardResponse> getFirstMarking(String courseCode,long id,String examType) {
        try{

            Long courseId=getCourseCodeId(courseCode);
            Long examinationId=id;
            Long examinationTypeId=getExaminationTypeId(examType);
            Set<StudentDTO> studentDTOS= new HashSet<>();
            List<ResultEntity> resultEntities=resultRepo.getResults(courseId,examinationId,examinationTypeId);
            if(resultEntities!=null){
                for(ResultEntity resultEntity:resultEntities){
                    StudentDTO studentDTO=new StudentDTO();
                    studentDTO.setStudentNumber(resultEntity.getStudent().getStudentNumber());
                    studentDTO.setFirstMarking(resultEntity.getFirstMarking());
                    if(resultEntity.getSecondMarking()!=0){
                        studentDTO.setSecondMarking(resultEntity.getSecondMarking());
                    }
                    else{
                        studentDTO.setSecondMarking(resultEntity.getFirstMarking());
                    }
                    studentDTO.setStudentName(resultEntity.getStudent().getStudentName());
                    studentDTOS.add(studentDTO);
                }
                return new ResponseEntity<>(
                        new StandardResponse(200, "success", studentDTOS), HttpStatus.OK
                );
            }
            else{
                return new ResponseEntity<>(
                        new StandardResponse(500, "failed to save data", null), HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

        }
        catch(Exception e){
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed to save data", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getAllExamsTypes() {
        try{
            List<ExamTypesEntity> examTypesEntities=examTypeRepo.getAllExamTypes();
            List<ExamTypesDTO> examTypesDTOS= new ArrayList<>();
            for(ExamTypesEntity examTypesEntity:examTypesEntities){
                ExamTypesDTO examTypesDTO=new ExamTypesDTO();
                examTypesDTO.setId(examTypesEntity.getId());
                examTypesDTO.setName(examTypesEntity.getExamType());
                examTypesDTOS.add(examTypesDTO);
            }
            return new ResponseEntity<>(
                    new StandardResponse(200, "success", examTypesDTOS), HttpStatus.OK
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    //save published results in database
    public ResponseEntity<StandardResponse> savePublishedResults(PublishedDataDTO publishedDataDTO, HttpServletRequest request){
        try{
            Object[] logedUserDetails=jwtService.getUserNameAndToken(request);
            String publisherName = (String) logedUserDetails[0];
            if(publishedDataDTO.getGrades().size()!=0 && publishedDataDTO.getCourseCode()!=null && publishedDataDTO.getExaminationId()!=null){
                CoursesEntity coursesEntity=coursesRepository.findByCourseCode(publishedDataDTO.getCourseCode());
                ExaminationEntity examinationEntity=examinationRepository.findExaminationById(publishedDataDTO.getExaminationId());
                UserEntity publisher=userManagementRepo.findByUsername(publisherName);
                LocalDateTime currentDateTime = LocalDateTime.now();
                for(GradeDetailsDTO gradeDetailsDTO:publishedDataDTO.getGrades()){
                    StudentsEntity studentsEntity=studentRepo.findByStudentNumber(gradeDetailsDTO.getStudentNumber());
                    Float finalMark=gradeDetailsDTO.getTotalMarks();
                    PublishedAndReCorrectedResultsEntity publishedAndReCorrectedResultsEntity=new PublishedAndReCorrectedResultsEntity();
                    publishedAndReCorrectedResultsEntity.setStudent(studentsEntity);
                    publishedAndReCorrectedResultsEntity.setExamination(examinationEntity);
                    publishedAndReCorrectedResultsEntity.setFinalMarks(finalMark);
                    publishedAndReCorrectedResultsEntity.setApprovedBy(publisher);
                    publishedAndReCorrectedResultsEntity.setCourse(coursesEntity);
                    publishedAndReCorrectedResultsEntity.setPublishAt(currentDateTime);
                    publishedResultsRepo.save(publishedAndReCorrectedResultsEntity);
                }
                return ResponseEntity.ok(new StandardResponse(200, "success", null));

            }
            else{

            return new ResponseEntity<>(
                    new StandardResponse(400,"missing input data", null), HttpStatus.BAD_REQUEST
            );
            }
        }
        catch(Exception e){
                e.printStackTrace();
                return new ResponseEntity<>(
                        new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
    }
}
