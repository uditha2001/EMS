package com.example.examManagementBackend.resultManagement.services;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.resultManagement.dto.DashboardPublishedResultsDTO;
import com.example.examManagementBackend.resultManagement.dto.DataForCalCulationDTO;
import com.example.examManagementBackend.resultManagement.dto.GradeDetailsDTO;
import com.example.examManagementBackend.resultManagement.dto.MarksPercentageDTO;
import com.example.examManagementBackend.resultManagement.entities.*;
import com.example.examManagementBackend.resultManagement.entities.Enums.ResultStatus;
import com.example.examManagementBackend.resultManagement.repo.CourseEvaluationRepo;
import com.example.examManagementBackend.resultManagement.repo.ExamTypeRepo;
import com.example.examManagementBackend.resultManagement.repo.PublishedResultsRepo;
import com.example.examManagementBackend.resultManagement.repo.ResultRepo;
import com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy.CalDataForAllYears;
import com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy.CalDataForaCourse;
import com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy.CalDataWithYear;
import com.example.examManagementBackend.resultManagement.services.DashBoardDataStartegy.DashBoardDataCalStartegy;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class GradingService {
    private final CourseEvaluationRepo courseEvaluationRepo;
    private final ExamTypeRepo examTypeRepo;
    private final CoursesRepository coursesRepository;
    private final ResultRepo resultRepo;
    private final PublishedResultsRepo publishedResultsRepo;
    private DashBoardDataCalStartegy dataCalStartegy;

    public GradingService(CourseEvaluationRepo courseEvaluationRepo, ExamTypeRepo examTypeRepo, CoursesRepository coursesRepository, ResultRepo resultRepo, PublishedResultsRepo publishedResultsRepo) {
        this.courseEvaluationRepo = courseEvaluationRepo;
        this.examTypeRepo = examTypeRepo;
        this.coursesRepository = coursesRepository;
        this.resultRepo = resultRepo;
        this.publishedResultsRepo = publishedResultsRepo;
    }

    /*
    used to get marks require to pass each exams types and marks percentage which get from
    each exams type to calculate final marks
    */
    public ResponseEntity<StandardResponse> getRequiredPercentagesAndPassMark(String courseCode) {
        try {
            List<CourseEvaluationsEntity> courseEvaluationsEntities = courseEvaluationRepo.getAllByCourseCode(courseCode);
            List<MarksPercentageDTO> marksPercentageDTOS = new ArrayList<>();
            for (CourseEvaluationsEntity courseEvaluationsEntity : courseEvaluationsEntities) {
                MarksPercentageDTO marksPercentageDTO = new MarksPercentageDTO();
                marksPercentageDTO.setExamType(courseEvaluationsEntity.getExamTypes().getExamType());
                marksPercentageDTO.setPassMark(courseEvaluationsEntity.getPassMark());
                marksPercentageDTO.setWeightage(courseEvaluationsEntity.getWeightage());
                marksPercentageDTOS.add(marksPercentageDTO);
            }
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", marksPercentageDTOS), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /*
    save changed grades marks
    */
    public ResponseEntity<StandardResponse> saveChangedGradings(List<MarksPercentageDTO> marksPercentageDTOs) {
        try {
            if (!marksPercentageDTOs.isEmpty()) {
                for (MarksPercentageDTO marksPercentageDTO : marksPercentageDTOs) {
                    if (courseEvaluationRepo.countByCourseCodeAndExamType(marksPercentageDTO.getCourseCode(), marksPercentageDTO.getExamType()) > 0) {
                        courseEvaluationRepo.updateByCourseCodeAndExamType(marksPercentageDTO.getPassMark(), marksPercentageDTO.getWeightage(), marksPercentageDTO.getCourseCode(), marksPercentageDTO.getExamType());

                    } else if (courseEvaluationRepo.countByCourseCodeAndExamType(marksPercentageDTO.getCourseCode(), marksPercentageDTO.getExamType()) == 0) {
                        ExamTypesEntity examTypesEntity = examTypeRepo.getExamTypeByName(marksPercentageDTO.getExamType());
                        CoursesEntity coursesEntity = coursesRepository.findByCourseCode(marksPercentageDTO.getCourseCode());
                        if (examTypesEntity != null && coursesEntity != null) {
                            CourseEvaluationsEntity courseEvaluationsEntity = new CourseEvaluationsEntity();
                            courseEvaluationsEntity.setPassMark(marksPercentageDTO.getPassMark());
                            courseEvaluationsEntity.setWeightage(marksPercentageDTO.getWeightage());
                            courseEvaluationsEntity.setCourses(coursesEntity);
                            courseEvaluationsEntity.setExamTypes(examTypesEntity);
                            courseEvaluationRepo.save(courseEvaluationsEntity);
                        } else {
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

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    //used to getStudents marks Grades
    public ResponseEntity<StandardResponse> getGradingsMark(String courseCode, Long examinationId) {
        try {
            LinkedHashMap<String, float[]> examtypesMarks = new LinkedHashMap<>();
            Map<String,List<String>> failedStudents = new HashMap<>();
            Map<String, Integer> gradeCount = new HashMap<>();
            Map<StudentsEntity,ResultEntity> studentNumbers = new LinkedHashMap<>();
            List<ResultEntity> studentResults = resultRepo.getStudentResultsByCourseCodeAndExamId(courseCode, examinationId, ResultStatus.SECOND_MARKING_COMPLETE);
            Set<GradeDetailsDTO> gradeDetailsDTOS = new LinkedHashSet<>();
            List<String> examTypeNames = resultRepo.getExamTypeName(courseCode, examinationId, ResultStatus.SECOND_MARKING_COMPLETE);
            if (!studentResults.isEmpty() && !examTypeNames.isEmpty()) {
                String Grade;
                for (String name : examTypeNames) {
                    float[] marksConditions = getExamTypesMarksConditions(courseCode, name);
                    examtypesMarks.put(name, marksConditions);
                }
                Map<String, Map<String, Float>> marksData = storeStudentDataWithExamTypeIdAndStudentNumber(studentResults);
                saveCalculatedMarksValues(marksData, examtypesMarks,failedStudents);
                extractStudent(studentNumbers, studentResults);
                for (Map.Entry<StudentsEntity,ResultEntity> student : studentNumbers.entrySet()) {
                    GradeDetailsDTO gradeDetailsDTO = new GradeDetailsDTO();
                    float totalMarks = calculateTotalMarks(marksData, student.getKey().getStudentNumber());
                    if (student.getValue().isAbsent() && !student.getValue().isHasSubmittedMedical()) {
                        gradeDetailsDTO.setGrade("ABSENT");
                        calculateGradeCount(gradeCount, "ABSENT ");

                    } else if (!student.getValue().isAbsent() && student.getValue().isHasSubmittedMedical()) {
                        gradeDetailsDTO.setGrade("MEDICAL");
                        calculateGradeCount(gradeCount, "MEDICAL ");

                    } else {
                        if(failedStudents.containsKey(student.getKey().getStudentNumber())) {
                            Grade="C-";
                        }
                        else{
                            Grade = gradeTheMarks(totalMarks);
                        }
                        calculateGradeCount(gradeCount, Grade);
                        gradeDetailsDTO.setGrade(Grade);
                    }
                    Map<String, Float> examTypesName = marksData.get(student.getKey().getStudentNumber());
                    gradeDetailsDTO.setStudentNumber(student.getKey().getStudentNumber());
                    gradeDetailsDTO.setStudentName(student.getKey().getStudentName());
                    gradeDetailsDTO.setTotalMarks(totalMarks);
                    gradeDetailsDTO.setExamTypesName(examTypesName);
                    gradeDetailsDTO.setFailedStudents(failedStudents);
                    gradeDetailsDTOS.add(gradeDetailsDTO);
                }
                Object[] responseData = new Object[]{gradeDetailsDTOS, gradeCount};
                return new ResponseEntity<>(
                        new StandardResponse(200, "sucess", responseData), HttpStatus.OK
                );
            } else {
                return new ResponseEntity<>(
                        new StandardResponse(422, "already published!", null), HttpStatus.UNPROCESSABLE_ENTITY
                );
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(404, "failed", null), HttpStatus.NOT_FOUND
            );
        }
    }

    //used to store students marks with their scNumber and examTypeId
    private Map<String, Map<String, Float>> storeStudentDataWithExamTypeIdAndStudentNumber(List<ResultEntity> results) {
        Map<String, Map<String, Float>> marksData = new HashMap<>();
        for (ResultEntity resultEntity : results) {
            marksData.putIfAbsent(resultEntity.getStudent().getStudentNumber(), new HashMap<>());
            marksData.get(resultEntity.getStudent().getStudentNumber()).put(resultEntity.getExamType().getExamType(), resultEntity.getSecondMarking());
        }
        return marksData;
    }

    //used to calculate the marks values for each exam type using stored map
    private void saveCalculatedMarksValues(Map<String, Map<String, Float>> marksData, LinkedHashMap<String, float[]> examtypesMarks,Map<String,List<String>> failedStudents) {
        examtypesMarks.forEach((examTypeID, examMarks) -> {
            marksData.forEach((studentNumber, studentMarks) -> {
                if (studentMarks.containsKey(examTypeID)) {
                    float marks = studentMarks.get(examTypeID);
                    if (marks >= examMarks[0]) {
                        marks = (float) Math.round((marks * (examMarks[1] / 100)));
                        studentMarks.put(examTypeID, marks);
                    } else {
                        failedStudents.computeIfAbsent(studentNumber, k -> new ArrayList<>()).add(examTypeID);                        marks = (float) Math.round((marks * (examMarks[1] / 100)));
                        studentMarks.put(examTypeID, marks);
                    }
                }
            });
        });
    }

    //calculate total marks
    private float calculateTotalMarks(Map<String, Map<String, Float>> marksData, String studentNumber) {
        float totalMarks = 0;
        if (marksData.containsKey(studentNumber)) {
            Map<String, Float> studentMarks = marksData.get(studentNumber);

            for (Map.Entry<String, Float> entry : studentMarks.entrySet()) {

                Float marks = entry.getValue();
                totalMarks += marks;
            }

        }
        return totalMarks;
    }

    //calculating gradings
    private String gradeTheMarks(float totalMarks) {
        if (85 <= totalMarks && totalMarks <= 100) {
            return "A+";
        } else if (70 <= totalMarks && totalMarks <= 84) {
            return "A ";
        } else if (65 <= totalMarks && totalMarks <= 69) {
            return "A-";
        } else if (60 <= totalMarks && totalMarks <= 64) {
            return "B+";
        } else if (55 <= totalMarks && totalMarks <= 59) {
            return "B ";
        } else if (50 <= totalMarks && totalMarks <= 54) {
            return "B-";
        } else if (45 <= totalMarks && totalMarks <= 49) {
            return "C+";
        } else if (40 <= totalMarks && totalMarks <= 44) {
            return "C ";
        } else if (35 <= totalMarks && totalMarks <= 39) {
            return "C-";
        } else if (30 <= totalMarks && totalMarks <= 34) {
            return "D+";
        } else if (25 <= totalMarks && totalMarks <= 29) {
            return "D ";
        } else {
            return "E ";
        }
    }

    //used to get students calculated marks from each type
    private float[] getExamTypesMarksConditions(String courseCode, String examTypeName) {
        if (courseEvaluationRepo.countByCourseCodeAndExamType(courseCode, examTypeName) > 0) {
            final float passMarks = courseEvaluationRepo.getPassMarkByCourseCodeAndCourseEvaluationId(courseCode, examTypeName);
            final float weightage = courseEvaluationRepo.getWeightageByCourseCodeAndCourseEvaluationId(courseCode, examTypeName);
            return new float[]{passMarks, weightage};
        }
        return new float[]{0, 0};
    }

    private void calculateGradeCount(Map<String, Integer> gradeDetails, String grade) {
        if (gradeDetails.containsKey(grade)) {
            int value = gradeDetails.get(grade);
            value += 1;
            gradeDetails.put(grade, value);
        } else {
            gradeDetails.put(grade, 1);
        }
    }

    private void extractStudent(Map<StudentsEntity,ResultEntity> studentNumbers, List<ResultEntity> resultEntities) {
        for (ResultEntity resultEntity : resultEntities) {
            studentNumbers.put(resultEntity.getStudent(),resultEntity);
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanUpNotifications() {
        LocalDateTime eightYearsAgo = LocalDateTime.now().minusYears(8);
        publishedResultsRepo.deletePublishedResultsOlderThanEightYears(eightYearsAgo);
    }


    public ResponseEntity<StandardResponse> getAllPublishedCoursesResults(Long id) {
        try {
            List<String> courseCode = publishedResultsRepo.getAllCourses(id);
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", courseCode), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getPublishedYears() {
        try {
            List<String> years = publishedResultsRepo.getAllYears();
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", years), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getAllExaminationDetails(Long id) {
        try {
            List<DataForCalCulationDTO> publishedResults = publishedResultsRepo.getAllResults(id);
            dataCalStartegy = new CalDataForAllYears();
            DashboardPublishedResultsDTO dashboardPublishedResultsDTO = dataCalStartegy.calculateDashboardData(publishedResults);
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", dashboardPublishedResultsDTO), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "Failed", null),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getPublishedExaminationDetailsUsingCourse(Long id, String Course) {
        try {
            List<DataForCalCulationDTO> publishedResults = publishedResultsRepo.getAllResultsByCode(id, Course);
            dataCalStartegy = new CalDataForaCourse();
            DashboardPublishedResultsDTO dashboardPublishedResultsDTO = dataCalStartegy.calculateDashboardData(publishedResults);
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", dashboardPublishedResultsDTO), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getpublishedDataByCourseAndYear(Long id, String courseCode, int year) {
        try {
            List<DataForCalCulationDTO> publishedResults = publishedResultsRepo.findByProgramIdAndCourseCodeAndPublishedYear(id, courseCode, year);
            dataCalStartegy = new CalDataForaCourse();
            DashboardPublishedResultsDTO dashboardPublishedResultsDTO = dataCalStartegy.calculateDashboardData(publishedResults);
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", dashboardPublishedResultsDTO), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "failed to fetch data", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public ResponseEntity<StandardResponse> getPublishedDataByProgramIdAndYear(Long id, int year) {
        try {
            List<DataForCalCulationDTO> publishedResults = publishedResultsRepo.findByProgramIdAndYear(id, year);
            dataCalStartegy = new CalDataWithYear();
            DashboardPublishedResultsDTO dashboardPublishedResultsDTO = dataCalStartegy.calculateDashboardData(publishedResults);
            return new ResponseEntity<>(
                    new StandardResponse(200, "sucess", dashboardPublishedResultsDTO), HttpStatus.OK
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    new StandardResponse(500, "Failed to fetch data", null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


}
