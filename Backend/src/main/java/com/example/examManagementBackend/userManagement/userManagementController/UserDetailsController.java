package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
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
    @PutMapping(path="/updateUser")
    public String updateUser(@RequestBody UserDTO userdto) {
        return null;
    }
}
