package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.LoginRequestDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.LoginResponseDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.JwtServiceIMPL;
import com.example.examManagementBackend.userManagement.userManagementServices.MailServiceIMPL;
import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
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
    private JwtServiceIMPL jwtServiceIMPL;
    @Autowired
    private UserManagementServices userManagementServices;
    @Autowired
    private MailServiceIMPL mailServiceIMPL;
    @PostMapping("/authentication")
    public ResponseEntity<StandardResponse> createJwtTokenAndLogin(@RequestBody LoginRequestDTO loginRequestDTO) throws IOException {
            LoginResponseDTO loginResponseDTO= jwtServiceIMPL.CreateJwtToken(loginRequestDTO);
            if(loginResponseDTO!=null){
                return new ResponseEntity<>(new StandardResponse(200,"login sucess",loginResponseDTO),HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(new StandardResponse(304,"login failed","bad"),HttpStatus.NOT_ACCEPTABLE);
            }
    }
    @PostMapping("/refresh-token")
    public LoginResponseDTO refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
             return   jwtServiceIMPL.refreshToken(request,response);
    }

    @PostMapping("/logout")
    public ResponseEntity<StandardResponse> logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
               String message= jwtServiceIMPL.cleanTokens(request);
               if(message.equals("ok")){
                   return new ResponseEntity<>(new StandardResponse(200,"logout ",message), HttpStatus.OK);
               }
               else{
                   return new ResponseEntity<>(new StandardResponse(304,"logout ",message), HttpStatus.INTERNAL_SERVER_ERROR);
               }
    }

    @PostMapping("/verifyuser")
    public ResponseEntity<StandardResponse> verifyUser(@RequestParam String username) throws IOException {
            String message= mailServiceIMPL.verifyUserMail(username);
            if(message.equals("ok")){
                String confirmMessage="verified sucessfully";
                return new ResponseEntity<>(new StandardResponse(200,"verify ",confirmMessage), HttpStatus.OK);
            }
            else{
                String statusMessage="invailid user or current user doesn't have a mail";
                return new ResponseEntity<>(new StandardResponse(404," not verify ",statusMessage), HttpStatus.BAD_REQUEST);
            }
    }
    @PostMapping("/otpValidate")
    public ResponseEntity<StandardResponse> otpValidate(@RequestParam String enteredOtp,@RequestParam String username) throws IOException {
        String message= mailServiceIMPL.verifyOtp(enteredOtp,username);
        if(message.equals("ok")){
            return new ResponseEntity<>(new StandardResponse(200,"verify ",message), HttpStatus.OK);
        }
        else{
            String statusMessage="verification faild!";
            return new ResponseEntity<>(new StandardResponse(304,"verify ",statusMessage), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    @PostMapping("/updatePassword")
    public ResponseEntity<StandardResponse> updatePassword(@RequestParam String password,@RequestParam String username) throws IOException {
        String message=userManagementServices.updatePassword(password,username);
        if(message.equals("ok")){
            return new ResponseEntity<>(new StandardResponse(200,"update password ",message), HttpStatus.OK);
        }
        else{
            String statusMessage="update password faild!";
            return new ResponseEntity<>(new StandardResponse(304,"update password ",statusMessage), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
