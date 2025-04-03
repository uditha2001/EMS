package com.example.examManagementBackend.userManagement.controllers;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.RoleService;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/api/v1/roles")
public class RolesController {

    @Autowired
    private RoleService roleService;

    // Create role
    @PostMapping("/create")
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO roleDTO) {
        RoleDTO role = roleService.createRole(
                roleDTO.getRoleName(),
                roleDTO.getDescription(),
                roleDTO.getPermissionIds());
        return ResponseEntity.ok(role);
    }

    // Update role
    @PutMapping("/update/{roleId}")
    public ResponseEntity<RoleDTO> updateRole(
            @PathVariable Long roleId,
            @RequestBody RoleDTO roleDTO) {
        RoleDTO role = roleService.updateRole(
                roleId,
                roleDTO.getRoleName(),
                roleDTO.getDescription(),
                roleDTO.getPermissionIds());
        return ResponseEntity.ok(role);
    }

    // View single role by ID
    @GetMapping("/view/{roleId}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long roleId) {
        RoleDTO role = roleService.getRoleById(roleId);
        return ResponseEntity.ok(role);
    }

    // View all roles
    @GetMapping("/all")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // Delete role
    @DeleteMapping("/delete/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/permissions")
    public ResponseEntity<Set<String>> getPermissionsForRoles(@RequestBody List<String> roleNames) {
        Set<String> permissionNames = roleService.getPermissionsForRoles(roleNames);
        return ResponseEntity.ok(permissionNames);
    }

    // Endpoint to get all roles without permissions
    @GetMapping("/without-permissions")
    public ResponseEntity<StandardResponse> getAllRolesWithoutPermissions() {
        List<RoleDTO> rolesWithoutPermissions = roleService.getAllRolesWithoutPermissions();
        StandardResponse response = new StandardResponse(200, "Roles fetched successfully", rolesWithoutPermissions);
        return ResponseEntity.ok(response);
    }

    // Endpoint to get specific roles by name
    @GetMapping("/specific-roles")
    public ResponseEntity<StandardResponse> getSpecificRoles() {
        List<RoleDTO> specificRoles = roleService.getSpecificRoles();
        StandardResponse response = new StandardResponse(200, "Specific roles fetched successfully", specificRoles);
        return ResponseEntity.ok(response);
    }
}
