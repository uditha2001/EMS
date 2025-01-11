package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.CreateRoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.dto.RoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.service.RoleAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/role-assignments")
public class RoleAssignmentController {
    @Autowired
    private RoleAssignmentService roleAssignmentService;

    @PostMapping
    public RoleAssignmentDTO assignRole(@RequestBody CreateRoleAssignmentDTO createRoleAssignmentDTO) {
        return roleAssignmentService.assignRole(createRoleAssignmentDTO);
    }
}

