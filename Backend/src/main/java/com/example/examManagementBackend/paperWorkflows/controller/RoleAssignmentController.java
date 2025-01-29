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
@RequestMapping("/api/v1/role-assignments")
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

    // Authorize role
    @PatchMapping("/{id}/authorize")
    public ResponseEntity<StandardResponse> authorizeRole(@PathVariable Long id) {
        RoleAssignmentDTO updatedRole = roleAssignmentService.authorizeRole(id);
        return ResponseEntity.ok(new StandardResponse(200, "Role authorized successfully", updatedRole));
    }

    // Unassign role
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> unassignRole(@PathVariable Long id) {
        roleAssignmentService.unassignRole(id);
        return ResponseEntity.ok(new StandardResponse(200, "Role unassigned successfully", null));
    }

    // Get all role assignments
    @GetMapping
    public ResponseEntity<StandardResponse> getAllRoleAssignments() {
        List<RoleAssignmentDTO> roles = roleAssignmentService.getAllRoleAssignments();
        return ResponseEntity.ok(new StandardResponse(200, "Fetched all role assignments", roles));
    }

    // Get role assignments by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<StandardResponse> getRoleAssignmentsByUser(@PathVariable Long userId) {
        List<RoleAssignmentDTO> roles = roleAssignmentService.getRoleAssignmentsByUser(userId);
        return ResponseEntity.ok(new StandardResponse(200, "Fetched role assignments for user", roles));
    }

    // Get role assignments by examination
    @GetMapping("/examination/{examinationId}")
    public ResponseEntity<StandardResponse> getRoleAssignmentsByExamination(@PathVariable Long examinationId) {
        List<RoleAssignmentDTO> roles = roleAssignmentService.getRoleAssignmentsByExamination(examinationId);
        return ResponseEntity.ok(new StandardResponse(200, "Fetched role assignments for the examination", roles));
    }

}
