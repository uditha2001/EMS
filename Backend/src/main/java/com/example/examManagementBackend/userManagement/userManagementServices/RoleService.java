package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleWithPermissionsDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolePermission;
import com.example.examManagementBackend.userManagement.userManagementRepo.PermissionRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.RolePermissionRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {

    @Autowired
    private RoleRepository rolesRepository;

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    // Create role
    @Transactional
    public RoleWithPermissionsDTO createRole(String roleName, String roleDescription, Set<Long> permissionIds) {
        RolesEntity role = new RolesEntity(roleName, roleDescription);
        RolesEntity savedRole = rolesRepository.save(role);

        // Assign permissions to the role
        Set<String> assignedPermissions = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                        .map(permission -> {
                            RolePermission rolePermission = new RolePermission();
                            rolePermission.setRolesEntity(savedRole);
                            rolePermission.setPermissionEntity(permission); // Ensure this method exists in RolePermission
                            rolePermissionRepository.save(rolePermission);
                            return permission.getPermissionName();
                        })
                        .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + permissionId)))
                .collect(Collectors.toSet());

        return new RoleWithPermissionsDTO(savedRole.getRoleName(), savedRole.getRoleDescription(), List.copyOf(assignedPermissions));
    }

    // Update role
    @Transactional
    public RoleWithPermissionsDTO updateRole(Long roleId, String roleName, String roleDescription, Set<Long> permissionIds) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        role.setRoleName(roleName);
        role.setRoleDescription(roleDescription);
        rolesRepository.save(role);

        // Update permissions for the role
        rolePermissionRepository.deleteAllByRolesEntity(role);
        Set<String> updatedPermissions = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                        .map(permission -> {
                            RolePermission rolePermission = new RolePermission();
                            rolePermission.setRolesEntity(role);
                            rolePermission.setPermissionEntity(permission); // Ensure this method exists in RolePermission
                            rolePermissionRepository.save(rolePermission);
                            return permission.getPermissionName();
                        })
                        .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + permissionId)))
                .collect(Collectors.toSet());

        return new RoleWithPermissionsDTO(role.getRoleName(), role.getRoleDescription(), List.copyOf(updatedPermissions));
    }

    // View role by ID
    public RoleWithPermissionsDTO getRoleById(Long roleId) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        Set<String> permissions = rolePermissionRepository.findByRolesEntity(role).stream()
                .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionName()) // Ensure this method exists in Permission
                .collect(Collectors.toSet());

        return new RoleWithPermissionsDTO(role.getRoleName(), role.getRoleDescription(), List.copyOf(permissions));
    }

    // Delete role
    @Transactional
    public void deleteRole(Long roleId) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        rolePermissionRepository.deleteAllByRolesEntity(role);
        rolesRepository.delete(role);
    }

    // Get all roles
    public List<RoleWithPermissionsDTO> getAllRoles() {
        List<RolesEntity> roles = rolesRepository.findAll();
        return roles.stream().map(role -> {
            Set<String> permissions = rolePermissionRepository.findByRolesEntity(role).stream()
                    .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionName()) // Ensure this method exists in Permission
                    .collect(Collectors.toSet());

            return new RoleWithPermissionsDTO(role.getRoleName(), role.getRoleDescription(), List.copyOf(permissions));
        }).collect(Collectors.toList());
    }
}
