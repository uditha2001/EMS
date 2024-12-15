package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class UserDetailsController {
    @Autowired
    private UserManagementServices userService;
    //used to add a user
    @PostMapping(path="/addUser")
    public String addUser(@RequestBody UserDTO userdto) {
        String message=userService.saveUser(userdto);
        System.out.println(message);
        return message;
    }
}
