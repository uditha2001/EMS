package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
