package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.resultManagement.dto.ResultDTO;
import com.example.examManagementBackend.resultManagement.dto.StudentDTO;
import com.example.examManagementBackend.resultManagement.entities.Enums.ExamTypesName;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.entities.ExamTypesEntity;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.resultManagement.entities.StudentsEntity;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.resultManagement.repo.StudentRepo;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

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
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;

    public ResultService(StudentRepo studentRepo, ResultRepo resultRepo, ExaminationRepository examinationRepo, CoursesRepository coursesRepo, ExamTypeRepo examTypeRepo, ModelMapper modelMapper, JwtService jwtService, UserManagementRepo userManagementRepo) {
        this.studentRepo = studentRepo;
        this.resultRepo = resultRepo;
        this.examinationRepo = examinationRepo;
        this.coursesRepo=coursesRepo;
        this.examTypeRepo=examTypeRepo;
        this.modelMapper=modelMapper;
        this.jwtService=jwtService;
        this.userManagementRepo = userManagementRepo;
    }
    public ResponseEntity<StandardResponse> saveFirstMarkingResults(ResultDTO results, HttpServletRequest request){
        try{
            if(results.getExamName()!=null && results.getCourseCode()!=null && results.getStudentsData()!=null && !results.getStudentsData().isEmpty()) {
                Object[] data=jwtService.getUserNameAndToken(request);
                String username = data[0].toString();
                UserEntity approvedBy=userManagementRepo.findByUsername(username);
                String[] examDetails=results.getExamName().split("-");
                String[] level=examDetails[2].split(" ");
                String[] semester=examDetails[3].split(" ");
                Long courseId=getCourseCodeId(results.getCourseCode());
                Long examinationId=getExaminationNameId(examDetails[0],level[1],semester[1]);
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
                        resultRepo.updateResults(student.getFirstMarking(),approvedBy,resultId);
                    }

                }
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(201,"sucess",null), HttpStatus.CREATED
                );
            }
            else{
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(500,"failed to save data",null), HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"failed to save data",null), HttpStatus.INTERNAL_SERVER_ERROR
            );        }
    }

    private Long getCourseCodeId(String code){
        return coursesRepo.getCourseIdByCode(code);
    }
    private Long getExaminationNameId(String year,String level,String semester){
        return examinationRepo.getExaminationIdByYearAndSemesterAndLevel(year,level,semester);
    }
    private Long getStudentsTableId(String studentNumber ){
        return studentRepo.getIdBystudentNumber(studentNumber);
    }

    private Long getExaminationTypeId(ExamTypesName examinationType){
            return examTypeRepo.getExamTypeIdByExamTypeName(examinationType);
    }

    public void saveStudentsDetails(StudentDTO student){
        if(studentRepo.IsEmpty(student.getStudentNumber())==0){
            StudentsEntity studentsEntity=new StudentsEntity();
            modelMapper.map(student, studentsEntity);
            studentRepo.save(studentsEntity);
        }
    }

    public ResponseEntity<StandardResponse> getFirstMarking(String courseCode,String examName,ExamTypesName examType) {
        try{
            String[] examDetails=examName.split("-");
            String[] level=examDetails[2].split(" ");
            String[] semester=examDetails[3].split(" ");
            Long courseId=getCourseCodeId(courseCode);
            Long examinationId=getExaminationNameId(examDetails[0],level[1],semester[1]);
            Long examinationTypeId=getExaminationTypeId(examType);
            Set<StudentDTO> studentDTOS=new HashSet<StudentDTO>();
            List<ResultEntity> resultEntities=resultRepo.getResults(courseId,examinationId,examinationTypeId, ResultStatus.FIRST_MARKING_COMPLETE);
            if(resultEntities!=null){
                for(ResultEntity resultEntity:resultEntities){
                    StudentDTO studentDTO=new StudentDTO();
                    studentDTO.setStudentNumber(resultEntity.getStudent().getStudentNumber());
                    studentDTO.setFirstMarking(resultEntity.getFirstMarking());
                    studentDTO.setStudentName(resultEntity.getStudent().getStudentName());
                    studentDTOS.add(studentDTO);
                }
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(200,"success",studentDTOS), HttpStatus.OK
                );
            }
            else{
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(500,"failed to save data",null), HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"failed to save data",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}
