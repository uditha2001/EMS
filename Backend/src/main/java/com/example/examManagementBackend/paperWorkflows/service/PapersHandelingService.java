package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.ExamPaperEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.PaperHandelingRepo;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class PapersHandelingService {
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;
    private final PaperHandelingRepo paperHandelingRepo;
    private final CoursesRepository coursesRepository;
    @Autowired
    public PapersHandelingService(JwtService jwtService,UserManagementRepo userManagementRepo,PaperHandelingRepo paperHandelingRepo,CoursesRepository coursesRepository) {
        this.jwtService = jwtService;
        this.userManagementRepo = userManagementRepo;
        this.paperHandelingRepo = paperHandelingRepo;
        this.coursesRepository = coursesRepository;
    }
    //save encrypted file
    public ResponseEntity<StandardResponse> saveFile(MultipartFile paperFile, String originalFileName,String CourseCode,HttpServletRequest request) {
        try{
            // Validate the originalFileName to ensure it does not contain path separators or parent directory references
            if (originalFileName.contains("..") || originalFileName.contains("/") || originalFileName.contains("\\")) {
                throw new IllegalArgumentException("Invalid filename");
            }

            Path uploadDir = Paths.get(System.getProperty("user.home"), "uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir); // Create directory if it doesn't exist
            }

            Path filePath = uploadDir.resolve(originalFileName);
            boolean isFileNameExist=paperHandelingRepo.existsByfilePath(filePath.toString());
            if(!isFileNameExist){
                Object[] objects=jwtService.getUserNameAndToken(request);
                String userName = (String) objects[0];
                UserEntity userEntity=userManagementRepo.findByUsername(userName);
                CoursesEntity coursesEntity=coursesRepository.findBycode(CourseCode);
                ExamPaperEntity examPaperEntity=new ExamPaperEntity(

                );
                examPaperEntity.setFilePath(filePath.toString());
                examPaperEntity.setCourse(coursesEntity);
                examPaperEntity.setUser(userEntity);
                paperHandelingRepo.save(examPaperEntity);
                return new ResponseEntity<>(
                        new StandardResponse(200, "File uploaded successfully", null),
                        HttpStatus.CREATED
                );
            } else if (isFileNameExist) {
                Files.copy(paperFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                return new ResponseEntity<>(
                        new StandardResponse(200, "File uploaded successfully", null),
                        HttpStatus.CREATED
                );
            }

        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"file upload faile",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(500,"file upload fail",null), HttpStatus.INTERNAL_SERVER_ERROR
        );

    }

    //send file to the requested user
    public ResponseEntity<StandardResponse> sendFile(MultipartFile paperFile, String CourseCode,HttpServletRequest request) {
        return null;
    }

}
