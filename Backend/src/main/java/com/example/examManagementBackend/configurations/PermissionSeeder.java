package com.example.examManagementBackend.configurations;

import com.example.examManagementBackend.userManagement.userManagementEntity.PermissionEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.security.Permission;

@Component
public class PermissionSeeder implements CommandLineRunner {

    @Autowired
    private PermissionRepository permissionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (permissionRepository.count() == 0) {  // Check if DB is empty
            PermissionEntity permission1 = new PermissionEntity( "View Users", "Allows viewing of users", "User Management");
            PermissionEntity permission2 = new PermissionEntity( "Edit Users", "Allows editing of user information", "User Management");
            PermissionEntity permission3 = new PermissionEntity( "Delete Users", "Allows deletion of user", "User Management");
            PermissionEntity permission4 = new PermissionEntity("Create Users", "Allows creating of new users", "User Management");
            PermissionEntity permission5 = new PermissionEntity("Edit User Profile", "Allows editing of user profile", "User Management");

            permissionRepository.save(permission1);
            permissionRepository.save(permission2);
            permissionRepository.save(permission3);
            permissionRepository.save(permission4);
            permissionRepository.save(permission5);

            System.out.println("Permissions seeded successfully!");
        } else {
            System.out.println("Permissions already exist in the database.");
        }
    }
}
