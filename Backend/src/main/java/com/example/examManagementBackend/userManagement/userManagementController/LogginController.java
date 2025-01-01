package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.LoginRequestDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.LoginResponseDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtService;
import com.example.examManagementBackend.userManagement.userManagementServices.MailService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/login")
public class LogginController {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private MailService mailService;
    @PostMapping("/authentication")
    public LoginResponseDTO createJwtTokenAndLogin(@RequestBody LoginRequestDTO loginRequestDTO) throws IOException {
            return jwtService.CreateJwtToken(loginRequestDTO);
    }
    @PostMapping("/refresh-token")
    public LoginResponseDTO refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
             return   jwtService.refreshToken(request,response);
    }

    @PostMapping("/logout")
    public ResponseEntity<StandardResponse> logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
               String message=jwtService.cleanTokens(request);
               if(message.equals("ok")){
                   return new ResponseEntity<>(new StandardResponse(200,"logout ",message), HttpStatus.OK);
               }
               else{
                   return new ResponseEntity<>(new StandardResponse(304,"logout ",message), HttpStatus.INTERNAL_SERVER_ERROR);
               }
    }

    @PostMapping("/verifyUser")
    public ResponseEntity<StandardResponse> verifyUser(@RequestParam String userName) throws IOException {
            String message=mailService.verifyUserMail(userName);
            if(message.equals("ok")){
                String confirmMessage="verified sucessfully";
                return new ResponseEntity<>(new StandardResponse(200,"verify ",confirmMessage), HttpStatus.OK);
            }
            else{
                String statusMessage="invailid user or current user doesn't have a mail";
                return new ResponseEntity<>(new StandardResponse(404," not verify ",statusMessage), HttpStatus.BAD_REQUEST);
            }
    }

}
