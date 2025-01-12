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

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.Cipher;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

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
    //genarate RSA keypairs
    public ResponseEntity<StandardResponse> generateKeys(HttpServletRequest request){
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair keyPair = keyGen.generateKeyPair();
            PrivateKey privateKey = keyPair.getPrivate();
            PublicKey publicKey = keyPair.getPublic();
            String privateKeyString = Base64.getEncoder().encodeToString(privateKey.getEncoded());
            String publicKeyString = Base64.getEncoder().encodeToString(publicKey.getEncoded());
            String[] keys = {privateKeyString, publicKeyString};
            Object[] objects=jwtService.getUserNameAndToken(request);
            String userName = (String) objects[0];
            if(userName!=null){
                userManagementRepo.updatePublicKey(userName,publicKeyString);
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(200,"key generation sucess",keys), HttpStatus.CREATED
                );
            }

        }
        catch(NoSuchAlgorithmException e){
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(500,"key generation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
                );
        }
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(500,"key generation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
        );

    }

    //save encrypted file
    public ResponseEntity<StandardResponse> saveFile(MultipartFile paperFile, String originalFileName,String CourseCode,HttpServletRequest request) {
        try{
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

    //genrate symetric key and encrypted it
    public ResponseEntity<StandardResponse> generateAESKey(HttpServletRequest request) {
        try {
            Object[] objects=jwtService.getUserNameAndToken(request);
            String userName = (String) objects[0];
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(256);
            SecretKey secretKey = keyGen.generateKey();
            byte[] aesKey = secretKey.getEncoded();
            String publicKeyString=userManagementRepo.getPublicKey(userName);
            PublicKey publickey=getUserPublicKey(publicKeyString);
            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            cipher.init(Cipher.ENCRYPT_MODE, publickey);
            byte[] encryptedKey = cipher.doFinal(aesKey);
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(200,"key creaion sucessfull",encryptedKey),HttpStatus.CREATED
            );
        } catch (Exception e) {
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"key creation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public PublicKey getUserPublicKey(String PublicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] publicKeyBytes = Base64.getDecoder().decode(PublicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        return publicKey;

    }



}
