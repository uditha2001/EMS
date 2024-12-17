package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.PermissionDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    // Endpoint to get all permissions
    @GetMapping
    public List<PermissionDTO> getAllPermissions() {
        return permissionService.getAllPermissions();
    }

    // Endpoint to get a specific permission by ID
    @GetMapping("/{id}")
    public PermissionDTO getPermissionById(@PathVariable Long id) {
        return permissionService.getPermissionById(id);
    }


    // Endpoint to get permissions by category
    @GetMapping("/category/{category}")
    public List<PermissionDTO> getPermissionsByCategory(@PathVariable String category) {
        return permissionService.getPermissionsByCategory(category);
    }


}
