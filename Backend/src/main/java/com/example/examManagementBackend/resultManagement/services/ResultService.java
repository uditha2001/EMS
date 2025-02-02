package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.resultManagement.dto.ResultDTO;
import com.example.examManagementBackend.resultManagement.dto.StudentDTO;
import com.example.examManagementBackend.resultManagement.entities.ResultEntity;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.resultManagement.repo.StudentRepo;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ResultService {
    private final StudentRepo studentRepo;
    private final ResultRepo resultRepo;
    private final ExaminationRepository examinationRepo;
    private final CoursesRepository coursesRepo;
    public ResultService(StudentRepo studentRepo, ResultRepo resultRepo,ExaminationRepository examinationRepo,CoursesRepository coursesRepo) {
        this.studentRepo = studentRepo;
        this.resultRepo = resultRepo;
        this.examinationRepo = examinationRepo;
        this.coursesRepo=coursesRepo;
    }
    public ResponseEntity<StandardResponse> saveFirstMarkingResults(ResultDTO results) {
        if(results.getExamName()!=null && results.getCourseCode()!=null && results.getStudentsData()!=null && !results.getStudentsData().isEmpty()) {
            String[] examDetails=results.getExamName().split("-");
            String[] level=examDetails[2].split(" ");
            String[] semester=examDetails[3].split(" ");
            Long courseId=getCourseCodeId(results.getCourseCode());
            Long examinationId=getExaminationNameId(examDetails[0],level[1],semester[1]);
            for(StudentDTO student: results.getStudentsData()){
                Long studentId=getStudentsTableId(student.getStudentNumber());
                ResultEntity resultEntity = new ResultEntity();

            }
        }

            return null;
    }

    public Long getCourseCodeId(String code){
        return coursesRepo.getCourseIdByCode(code);
    }
    public Long getExaminationNameId(String year,String level,String semester){
        return examinationRepo.getExaminationIdByYearAndSemesterAndLevel(year,level,semester);
    }
    public Long getStudentsTableId(String studentNumber ){
        return studentRepo.getIdBystudentNumber(studentNumber);
    }
}
