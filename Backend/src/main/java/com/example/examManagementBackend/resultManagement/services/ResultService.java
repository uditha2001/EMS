package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.dto.ExaminationDTO;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;
import com.example.examManagementBackend.paperWorkflows.service.RoleAssignmentService;
import com.example.examManagementBackend.resultManagement.dto.*;
import com.example.examManagementBackend.resultManagement.entities.*;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.repo.*;
import com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces.JwtService;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ResultService {
    private final StudentRepo studentRepo;
    private final ResultRepo resultRepo;
    private final ExaminationRepository examinationRepo;
    private final CoursesRepository coursesRepo;
    private final ExamTypeRepo examTypeRepo;
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;
    private final PublishedResultsRepo publishedResultsRepo;
    private final RoleAssignmentService roleAssignmentService;
    private final RoleAssignmentRepository roleAssignmentRepository;
    private final CourseEvaluationRepo courseEvaluationRepo;
    private final RecorrectionRepo recorrectionRepo;

    public ResultService(StudentRepo studentRepo, ResultRepo resultRepo, ExaminationRepository examinationRepo, CoursesRepository coursesRepo, ExamTypeRepo examTypeRepo, JwtService jwtService, UserManagementRepo userManagementRepo, PublishedResultsRepo publishedResultsRepo, RoleAssignmentService roleAssignmentService, RoleAssignmentRepository roleAssignmentRepository, CourseEvaluationRepo courseEvaluationRepo, RecorrectionRepo recorrectionRepo) {
        this.studentRepo = studentRepo;
        this.resultRepo = resultRepo;
        this.examinationRepo = examinationRepo;
        this.coursesRepo=coursesRepo;
        this.examTypeRepo=examTypeRepo;
        this.jwtService = jwtService;
        this.userManagementRepo = userManagementRepo;
        this.publishedResultsRepo = publishedResultsRepo;
        this.roleAssignmentService = roleAssignmentService;
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.courseEvaluationRepo = courseEvaluationRepo;
        this.recorrectionRepo = recorrectionRepo;

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
                        resultEntity.setStatus(ResultStatus.FIRST_MARKING_COMPLETE);
                        if(!student.isAbsent() && !student.isHasMedicalSubmit()){
                            resultEntity.setFirstMarking(student.getFirstMarking());
                        } else if (student.isAbsent() && !student.isHasMedicalSubmit()) {
                            resultEntity.setAbsent(true);
                            resultEntity.setFirstMarking(0);
                        } else if (student.isHasMedicalSubmit()) {
                            resultEntity.setHasSubmittedMedical(true);
                            resultEntity.setFirstMarking(0);
                        }
                        resultEntity.setApprovedBy(approvedBy);
                        resultRepo.save(resultEntity);

                    }
                    else if(resultRepo.isEmpty(examinationId,studentId,examinationTypeId,courseId)>0){
                      updateResults(examinationId,studentId,examinationTypeId,courseId,results,student,approvedBy);
                    }

                }
                if(results.getStatus().equals("secondMarking")){
                    updateSecondMarkingMedicalResults();
                    updateSecondMarkingAbsentResults();
                }
                roleAssignmentService.updateRoleAssignmentsFromResults();
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

    private void updateResults(Long examinationId,Long studentId,Long examinationTypeId,Long courseId,ResultDTO results,StudentDTO student,UserEntity approvedBy ){
        Long resultId= resultRepo.getResultIdIfExists(examinationId,studentId,examinationTypeId,courseId);
        if(results.getStatus().equals("secondMarking")){
            resultRepo.updateSecondMarkingResults(student.getSecondMarking(),approvedBy,resultId,ResultStatus.SECOND_MARKING_COMPLETE);

        } else if (results.getStatus().equals("firstMarking")) {

            if(!student.isAbsent() && !student.isHasMedicalSubmit()){
                resultRepo.updateFirstMarkingResults(student.getFirstMarking(),approvedBy,resultId,ResultStatus.FIRST_MARKING_COMPLETE,false,false);
            } else if (student.isAbsent() && !student.isHasMedicalSubmit()) {
                resultRepo.updateFirstMarkingResults(0,approvedBy,resultId,ResultStatus.FIRST_MARKING_COMPLETE,true,false);
            }
            else {
                resultRepo.updateFirstMarkingResults(0,approvedBy,resultId,ResultStatus.FIRST_MARKING_COMPLETE,false,true);
            }
        }
    }

    private void updateSecondMarkingAbsentResults(){
        List<Long> absentResultsId=resultRepo.getResultIdsByAbsentANDMedical(true,false);
        for(Long resultId: absentResultsId){
            resultRepo.updateSecondMarks(0,resultId);
        };
    }
    private void updateSecondMarkingMedicalResults(){
        List<Long> medicalResultsId=resultRepo.getResultIdsByAbsentANDMedical(false,true);
        for(Long resultId: medicalResultsId){
            resultRepo.updateSecondMarks(0,resultId);
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
            List<ResultEntity> resultEntities=resultRepo.getFirstMarkingResults(courseId,examinationId,examinationTypeId,ResultStatus.FIRST_MARKING_COMPLETE);
            if(!resultEntities.isEmpty()){
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
                        new StandardResponse(422, "already completed", null), HttpStatus.UNPROCESSABLE_ENTITY
                );
            }

        }
        catch(Exception e){
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed to save data", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getAllAssignedExamsTypes(String courseCode,HttpServletRequest request,Long examId,String roleName) {
        try{
            List<String> evaluationsType=courseEvaluationRepo.getExamTypesByCourseCode(courseCode);
            Object[] loginData=jwtService.getUserNameAndToken(request);
            String name=loginData[0].toString();
            Long userId=userManagementRepo.getUserIdByUsername(name);
            List<PaperType> assignedExamTypes=roleAssignmentRepository.getPaperTypeByCourseCode(courseCode,userId,roleName,examId);
            List<ExamTypesDTO> examTypes=new ArrayList<>();
            for (String type : evaluationsType) {
                if (type.equalsIgnoreCase("THEORY") || type.equalsIgnoreCase("PRACTICAL")) {
                    boolean isAssigned = false;
                    for (PaperType paperType : assignedExamTypes) {
                        if (type.equalsIgnoreCase(paperType.toString())) {
                            isAssigned = true;
                            break;
                        }
                    }
                    if (isAssigned) {
                        ExamTypesDTO examTypesDTO=new ExamTypesDTO();
                        examTypesDTO.setName(type);
                        examTypes.add(examTypesDTO);
                    }
                } else {
                    ExamTypesDTO examTypesDTO=new ExamTypesDTO();
                    examTypesDTO.setName(type);
                    examTypes.add(examTypesDTO);
                }
            }

            return new ResponseEntity<>(
                    new StandardResponse(200, "success", examTypes), HttpStatus.OK
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
                CoursesEntity coursesEntity=coursesRepo.findByCourseCode(publishedDataDTO.getCourseCode());
                ExaminationEntity examinationEntity=examinationRepo.findExaminationById(publishedDataDTO.getExaminationId());
                UserEntity publisher=userManagementRepo.findByUsername(publisherName);
                LocalDateTime currentDateTime = LocalDateTime.now();
                for(GradeDetailsDTO gradeDetailsDTO:publishedDataDTO.getGrades()){
                    Long publishedResultId=publishedResultsRepo.getPublishedResultIdIfExists(publishedDataDTO.getExaminationId(),gradeDetailsDTO.getStudentNumber(),publishedDataDTO.getCourseCode());
                    if(publishedResultId==null){
                        StudentsEntity studentsEntity=studentRepo.findByStudentNumber(gradeDetailsDTO.getStudentNumber());
                        Float finalMark=gradeDetailsDTO.getTotalMarks();
                        PublishedResultsEntity publishedResultsEntity =new PublishedResultsEntity();
                        publishedResultsEntity.setStudent(studentsEntity);
                        publishedResultsEntity.setExamination(examinationEntity);
                        publishedResultsEntity.setFinalMarks(finalMark);
                        publishedResultsEntity.setApprovedBy(publisher);
                        publishedResultsEntity.setCourse(coursesEntity);
                        publishedResultsEntity.setPublishAt(currentDateTime);
                        publishedResultsEntity.setGrade(gradeDetailsDTO.getGrade());
                        publishedResultsRepo.save(publishedResultsEntity);
                        Map<String,Float> examType=gradeDetailsDTO.getExamTypesName();
                        String examTypeName = examType.keySet().iterator().next();
                        Long examTypeId=examTypeRepo.getExamTypeIdByExamTypeName(examTypeName);
                        Long ResultId= resultRepo.getResultIdIfExists(publishedDataDTO.getExaminationId(),studentsEntity.getStudentId(),examTypeId,coursesEntity.getId());
                        resultRepo.updatePublishedResults(ResultStatus.PUBLISHED,finalMark,publisher,ResultId);
                    }
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
    //get absent students details
    public ResponseEntity<StandardResponse> getAbsentStudents(String courseCode,Long examId){
        try{
            List<ResultStatus> statuses = Arrays.asList(ResultStatus.FIRST_MARKING_COMPLETE, ResultStatus.SECOND_MARKING_COMPLETE);
            List<StudentsEntity> absentStudents = resultRepo.getAllAbsentStudents(courseCode, examId, true, statuses);
            List<StudentDTO> studentDTOList=new ArrayList<>();
            for(StudentsEntity studentsEntity:absentStudents){
                StudentDTO studentDTO=new StudentDTO();
                studentDTO.setStudentNumber(studentsEntity.getStudentNumber());
                studentDTO.setStudentName(studentsEntity.getStudentName());
                studentDTOList.add(studentDTO);

            }
            return new ResponseEntity<>(
                    new StandardResponse(200, "success", studentDTOList), HttpStatus.OK
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> saveMedicalResults(List<MedicalSubmitDTO> medicalSubmitDTOList, HttpServletRequest request,String courseCode,Long examId){
        try{
            Object[] user=jwtService.getUserNameAndToken(request);
            String username = (String) user[0];
            for(MedicalSubmitDTO medicalSubmitDTO:medicalSubmitDTOList){
                if ("approved".equalsIgnoreCase(medicalSubmitDTO.getStatus())) {
                    resultRepo.updateMedical(
                            username,
                            false,
                            true,
                            examId,
                            courseCode,
                            medicalSubmitDTO.getStudentNumber()
                    );
                }

            }

            return new ResponseEntity<>(
                    new StandardResponse(200, "success", null), HttpStatus.OK
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    public ResponseEntity<StandardResponse> getAllOnGoingExams(){
        try{
            List<ResultStatus> resultStatuses = Arrays.asList(ResultStatus.FIRST_MARKING_COMPLETE, ResultStatus.SECOND_MARKING_COMPLETE);
            List<ExaminationEntity> examinationEntities=resultRepo.findAllOngoingExaminationsByStatus(resultStatuses,ExamStatus.ONGOING);
            List<ExaminationDTO> examinationDTOS=new ArrayList<>();
            for(ExaminationEntity examinationEntity:examinationEntities){
                ExaminationDTO examinationDTO=mapToDTO(examinationEntity);
                examinationDTOS.add(examinationDTO);
            }
            return new ResponseEntity<>(
                    new StandardResponse(200,"sucess",examinationDTOS),HttpStatus.OK
            );
        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500,"error occur",null),HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

    }
    private ExaminationDTO mapToDTO(ExaminationEntity entity) {
        ExaminationDTO dto = new ExaminationDTO();
        dto.setId(entity.getId());
        dto.setYear(entity.getYear());
        dto.setLevel(entity.getLevel());
        dto.setSemester(entity.getSemester());
        dto.setDegreeProgramId(entity.getDegreeProgramsEntity().getId());
        dto.setDegreeProgramName(entity.getDegreeProgramsEntity().getDegreeName());
        dto.setExamProcessStartDate(entity.getExamProcessStartDate());
        dto.setPaperSettingCompleteDate(entity.getPaperSettingCompleteDate());
        dto.setMarkingCompleteDate(entity.getMarkingCompleteDate());
        dto.setStatus(entity.getStatus());
        return dto;
    }
    //used to get all results published exams
    public ResponseEntity<StandardResponse> getAllPublishedExams(){
        try{
            List<ExaminationEntity> publishedExams=publishedResultsRepo.getAllExaminations(ResultStatus.PUBLISHED);
            List<ExaminationDTO> publishEdexaminationDTOS=new ArrayList<>();
            for(ExaminationEntity examinationEntity:publishedExams){
                ExaminationDTO examinationDTO=mapToDTO(examinationEntity);
                publishEdexaminationDTOS.add(examinationDTO);
            }
            return new ResponseEntity<>(
                    new StandardResponse(200,"success",publishEdexaminationDTOS),HttpStatus.OK
            );


        }
        catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
//used to save recorrectionresults in a recorrection_results table and update the publishedresult table status
public ResponseEntity<StandardResponse> saveRecorrectionsResults(List<RecorrectionResultsDTO> recorrectionResultsDTOS,String courseCode,Long examId,HttpServletRequest request){
        try{
            Object[] userDetails=jwtService.getUserNameAndToken(request);
            String username = (String) userDetails[0];
            UserEntity userEntity=userManagementRepo.findByUsername(username);
            ExaminationEntity examinationEntity=examinationRepo.findExaminationById(examId);
            CoursesEntity coursesEntity=coursesRepo.findByCourseCode(courseCode);
            if(userEntity!=null && courseCode!=null){
                if(examId!=null){
                    for(RecorrectionResultsDTO recorrectionResultsDTO:recorrectionResultsDTOS){
                        Long recorecctionResultsId=recorrectionRepo.getRecorectedResultIdIfExists(examId,recorrectionResultsDTO.getStudentNumber(),coursesEntity.getId());
                        if(recorecctionResultsId==null){
                            StudentsEntity studentsEntity=studentRepo.findByStudentNumber(recorrectionResultsDTO.getStudentNumber());
                            RecorrectionEntity recorrectionEntity=new RecorrectionEntity();
                            recorrectionEntity.setExamination(examinationEntity);
                            recorrectionEntity.setCourse(coursesEntity);
                            recorrectionEntity.setStudent(studentsEntity);
                            recorrectionEntity.setApprovedBy(userEntity);
                            recorrectionEntity.setNewMarks(recorrectionResultsDTO.getNewMarks());
                            recorrectionEntity.setOldMarks(recorrectionResultsDTO.getOldMarks());
                            recorrectionEntity.setNewGrade(recorrectionResultsDTO.getNewGrade());
                            recorrectionEntity.setReason(recorrectionResultsDTO.getReason());
                            recorrectionRepo.save(recorrectionEntity);
                            publishedResultsRepo.updateStatusByCourseAndExamAndStudent(ResultStatus.RE_CORRECTION,userEntity,recorrectionResultsDTO.getNewMarks(),recorrectionResultsDTO.getNewGrade(),courseCode,examId, recorrectionResultsDTO.getStudentNumber());
                        }

                    }
                    return new ResponseEntity<>(
                            new StandardResponse(200,"success",null),HttpStatus.OK
                    );

                }
            }
            return new ResponseEntity<>(
                    new StandardResponse(400,"success",null),HttpStatus.BAD_REQUEST
            );
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "error", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
