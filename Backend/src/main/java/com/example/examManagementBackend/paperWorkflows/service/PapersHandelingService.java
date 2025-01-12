package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.*;
import java.util.Base64;

@Service
public class PapersHandelingService {
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;
    @Autowired
    public PapersHandelingService(JwtService jwtService,UserManagementRepo userManagementRepo) {
        this.jwtService = jwtService;
        this.userManagementRepo = userManagementRepo;
    }
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


    public ResponseEntity<StandardResponse> saveFile(MultipartFile paperFile, String originalFileName) {
        try{


        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"key generation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
