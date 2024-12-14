package com.example.examManagementBackend.userManagement.userManagementController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class userManagementController {
            @GetMapping("/test")
            public String test(){
                return "test";
            }
}
