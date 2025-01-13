package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class CryptographyService {
    private final JwtService jwtService;
    private final UserManagementRepo userManagementRepo;
    public CryptographyService(JwtService jwtService, UserManagementRepo userManagementRepo) {
        this.jwtService = jwtService;
        this.userManagementRepo = userManagementRepo;
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
            if(publicKeyString!=null){
                PublicKey publickey=getUserPublicKey(publicKeyString);
                Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
                cipher.init(Cipher.ENCRYPT_MODE, publickey);
                byte[] encryptedKey = cipher.doFinal(aesKey);
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(200,"key creaion sucessfull",encryptedKey),HttpStatus.CREATED
                );
            }

        } catch (Exception e) {
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"key creation failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(500,"can't find the public key",null), HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    public PublicKey getUserPublicKey(String PublicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] publicKeyBytes = Base64.getDecoder().decode(PublicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PublicKey publicKey = keyFactory.generatePublic(keySpec);
        return publicKey;

    }

//save public key in the database
    public ResponseEntity<StandardResponse> savePublicKey(PublicKey publicKey,HttpServletRequest request) {
        try{
            String publicKeyString = Base64.getEncoder().encodeToString(publicKey.getEncoded());
            Object[] objects=jwtService.getUserNameAndToken(request);
            String userName = (String) objects[0];
            if(userName!=null){
                userManagementRepo.updatePublicKey(userName,publicKeyString);
                return new ResponseEntity<StandardResponse>(
                        new StandardResponse(200,"key stored sucess",null), HttpStatus.OK
                );
            }
        }
        catch(Exception e){
            return new ResponseEntity<StandardResponse>(
                    new StandardResponse(500,"key stored failed",null), HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
     return new ResponseEntity<StandardResponse>(
             new StandardResponse(500,"key stored failed",null), HttpStatus.INTERNAL_SERVER_ERROR
     );
    }
}
