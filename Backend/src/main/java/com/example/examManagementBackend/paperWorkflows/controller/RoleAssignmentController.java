package com.example.examManagementBackend.paperWorkflows.controller;

import com.example.examManagementBackend.paperWorkflows.dto.CreateRoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.dto.RoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.service.RoleAssignmentService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/role-assignments")
public class RoleAssignmentController {

    @Autowired
    private RoleAssignmentService roleAssignmentService;

    // Single role assignment
    @PostMapping
    public ResponseEntity<StandardResponse> assignRole(@RequestBody CreateRoleAssignmentDTO createRoleAssignmentDTO) {
        RoleAssignmentDTO assignedRole = roleAssignmentService.assignRole(createRoleAssignmentDTO);

        return new ResponseEntity<>(
                new StandardResponse(201, "Role assigned successfully", assignedRole),
                HttpStatus.CREATED
        );
    }

    // Bulk role assignment
    @PostMapping("/bulk")
    public ResponseEntity<StandardResponse> assignMultipleRoles(@RequestBody List<CreateRoleAssignmentDTO> roleAssignmentsDTOs) {
        List<RoleAssignmentDTO> roleAssignments = new ArrayList<>();
        try {
            for (CreateRoleAssignmentDTO dto : roleAssignmentsDTOs) {
                RoleAssignmentDTO assignmentDTO = roleAssignmentService.assignRole(dto);
                roleAssignments.add(assignmentDTO);
            }
            // Return a response with all assigned roles in the body
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new StandardResponse(201, "Roles assigned successfully", roleAssignments));
        } catch (Exception e) {
            // Handle errors during role assignment
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StandardResponse(500, "Error assigning roles", e.getMessage()));
        }
    }
}
