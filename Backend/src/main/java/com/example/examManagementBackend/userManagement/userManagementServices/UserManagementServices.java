package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserManagementServices {
    @Autowired
    UserManagementRepo userManagementRepo;
    public String saveUser(UserDTO user){
        UserEntity userEntity = new UserEntity(user.getPassword(),user.getUsername(),user.getEmail(),user.getFirstName(),user.getLastName(),0,true);
        userManagementRepo.save(userEntity);
        return "success";
    }
}
