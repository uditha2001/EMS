package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.userManagement.userManagementDTO.LoginResponseDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.TokenEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.TokenRepo;
import com.example.examManagementBackend.utill.JwtUtill;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.*;
import java.util.Base64;

@Service
public class PapersHandelingService {
    @Autowired
    TokenRepo tokenRepo;
    @Autowired
    JwtUtill jwtUtill;


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
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(200,"key generation sucess",keys), HttpStatus.CREATED
            );
        }
        catch(NoSuchAlgorithmException e){
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(500,"key generation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
                );
        }

    }

    public String getUserName(HttpServletRequest request){
        final String authorizationHeader = request.getHeader("Authorization");
        String acesssToken=null;
        String userName=null;
        String refreshToken=null;
        TokenEntity token=null;
        LoginResponseDTO loginResponseDTO=null;
        UserEntity userEntity=null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            acesssToken= authorizationHeader.substring(7);
            token=tokenRepo.findByAcessToken(acesssToken);
            refreshToken=token.getRefreshToken();
            userName=jwtUtill.extractUserName(refreshToken);
        }
        return userName;

    }


}
