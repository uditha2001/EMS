package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserManagementServices {
    @Autowired
    UserManagementRepo userManagementRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    public String saveUser(UserDTO user){
        UserEntity userEntity = new UserEntity(user.getUsername(),user.getEmail(),user.getFirstName(),user.getLastName(),0,true);
        userEntity.setPassword(getEncodePassword(user.getPassword()));
        userManagementRepo.save(userEntity);
        return "success";
    }

    public String getEncodePassword(String password){
        return passwordEncoder.encode(password);
    }
}
