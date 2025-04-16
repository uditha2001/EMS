package com.example.examManagementBackend.userManagement.controllers;

import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user")
public class UserConfirmationController {
    private final UserManagementServices userManagementServices;
    public UserConfirmationController(UserManagementServices userManagementServices) {
        this.userManagementServices = userManagementServices;
    }
    //used to validate user from  password
    @GetMapping("/confirm")
    public ResponseEntity<StandardResponse> isUserConfirmed(@RequestParam("password") String password, HttpServletRequest request) {
        return userManagementServices.isUserValid(password, request);
    }
}
