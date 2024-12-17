package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.RoleWithPermissionsDTO;
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
    public ResponseEntity<RoleWithPermissionsDTO> createRole(@RequestBody RoleDTO roleDTO) {
        RoleWithPermissionsDTO role = roleService.createRole(
                roleDTO.getRoleName(),
                roleDTO.getDescription(),
                roleDTO.getPermissionIds());
        return ResponseEntity.ok(role);
    }

    // Update role
    @PutMapping("/update/{roleId}")
    public ResponseEntity<RoleWithPermissionsDTO> updateRole(
            @PathVariable Long roleId,
            @RequestBody RoleDTO roleDTO) {
        RoleWithPermissionsDTO role = roleService.updateRole(
                roleId,
                roleDTO.getRoleName(),
                roleDTO.getDescription(),
                roleDTO.getPermissionIds());
        return ResponseEntity.ok(role);
    }

    // View single role by ID
    @GetMapping("/view/{roleId}")
    public ResponseEntity<RoleWithPermissionsDTO> getRoleById(@PathVariable Long roleId) {
        RoleWithPermissionsDTO role = roleService.getRoleById(roleId);
        return ResponseEntity.ok(role);
    }

    // View all roles
    @GetMapping("/all")
    public ResponseEntity<List<RoleWithPermissionsDTO>> getAllRoles() {
        List<RoleWithPermissionsDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // Delete role
    @DeleteMapping("/delete/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long roleId) {
        roleService.deleteRole(roleId);
        return ResponseEntity.noContent().build();
    }
}
