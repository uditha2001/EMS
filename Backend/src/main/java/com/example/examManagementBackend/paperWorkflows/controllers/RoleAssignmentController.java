package com.example.examManagementBackend.paperWorkflows.controllers;

import com.example.examManagementBackend.paperWorkflows.dto.*;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.service.RoleAssignmentService;
import com.example.examManagementBackend.utill.StandardResponse;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/api/v1/role-assignments")
public class RoleAssignmentController {

    private final RoleAssignmentService roleAssignmentService;

    public RoleAssignmentController(RoleAssignmentService roleAssignmentService) {
        this.roleAssignmentService = roleAssignmentService;
    }

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
        String message = roleAssignmentService.authorizeRole(id);
        return ResponseEntity.ok(new StandardResponse(200, message, null));
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

    // Edit role assignment by ID
    @PutMapping("/{id}")
    public ResponseEntity<StandardResponse> editRoleAssignmentUser(@PathVariable Long id,
                                                                   @RequestParam("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body(new StandardResponse(400, "User ID is required", null));
        }

        String message = roleAssignmentService.editRoleAssignment(id, userId);
        return ResponseEntity.ok(new StandardResponse(200, message, null));
    }



    // Authorize roles for a given examination
    @PatchMapping("/examination/{examinationId}/authorize")
    public ResponseEntity<StandardResponse> authorizeRolesByExamination(@PathVariable Long examinationId) {
        String message = roleAssignmentService.authorizeRolesByExamination(examinationId);
        return ResponseEntity.ok(new StandardResponse(200, message, null));
    }

    // Authorize roles for a given course and paper type
    @PatchMapping("/course/{courseId}/paperType/{paperType}/authorize")
    public ResponseEntity<StandardResponse> authorizeRolesByCourseAndPaperType(@PathVariable Long courseId,
                                                                               @PathVariable PaperType paperType) {
        String message = roleAssignmentService.authorizeRolesByCourseAndPaperType(courseId, paperType);
        return ResponseEntity.ok(new StandardResponse(200, message, null));
    }

    // Get role assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<StandardResponse> getRoleAssignmentById(@PathVariable Long id) {
        RoleAssignmentDTO roleAssignment = roleAssignmentService.getRoleAssignmentById(id);
        return ResponseEntity.ok(new StandardResponse(200, "Role assignment fetched successfully", roleAssignment));
    }

    @GetMapping("/moderators")
    public ResponseEntity<StandardResponse> getPaperModeratorsByCourseAndPaperType(
            @RequestParam Long courseId,
            @RequestParam PaperType paperType) {

        List<GetModeratorDTO> moderators = roleAssignmentService.getPaperModeratorsByCourseAndPaperType(courseId, paperType);

        return ResponseEntity.ok(new StandardResponse(200, "Paper moderators fetched successfully", moderators));
    }

    // Multiple revisions
    @PutMapping("/change-users")
    public List<RoleAssignmentRevisionResponseDTO> changeAssignedUsers(@RequestBody List<RoleAssignmentRevisionRequestDTO> requestDTOList) {
        return roleAssignmentService.changeAssignedUsers(requestDTOList);
    }

    @GetMapping("/revision/{examinationId}")
    public ResponseEntity<StandardResponse> getRevisionsByExamination(
            @PathVariable String examinationId) {
        List<RoleAssignmentRevisionDTO> revisions = roleAssignmentService.getRevisionsByExamination(Long.valueOf(examinationId));
        return ResponseEntity.ok(new StandardResponse(200, "Role Assignment Revision fetched successfully",revisions));
    }

     @GetMapping("/FirstMarkingexaminations")
     public ResponseEntity<StandardResponse> getExaminations(HttpServletRequest request) {
        return roleAssignmentService.getAllExaminations(request,"FIRST_MARKER");
     }
    @GetMapping("/secondMarkingexaminations")
    public ResponseEntity<StandardResponse> getSecondMarkingExaminations(HttpServletRequest request) {
        return roleAssignmentService.getAllExaminations(request,"SECOND_MARKER");
    }
}
