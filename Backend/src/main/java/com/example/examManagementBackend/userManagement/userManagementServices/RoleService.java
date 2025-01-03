package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolePermission;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
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
    public RoleDTO createRole(String roleName, String roleDescription, Set<Long> permissionIds) {
        RolesEntity role = new RolesEntity(roleName, roleDescription);
        RolesEntity savedRole = rolesRepository.save(role);

        // Assign permissions to the role
        Set<Long> assignedPermissionIds = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                        .map(permission -> {
                            RolePermission rolePermission = new RolePermission();
                            rolePermission.setRolesEntity(savedRole);
                            rolePermission.setPermissionEntity(permission); // Ensure this method exists in RolePermission
                            rolePermissionRepository.save(rolePermission);
                            return permission.getPermissionId();
                        })
                        .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + permissionId)))
                .collect(Collectors.toSet());

        return new RoleDTO(savedRole.getRoleId(), savedRole.getRoleName(), savedRole.getRoleDescription(), assignedPermissionIds);
    }

    // Update role
    @Transactional
    public RoleDTO updateRole(Long roleId, String roleName, String roleDescription, Set<Long> permissionIds) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        role.setRoleName(roleName);
        role.setRoleDescription(roleDescription);
        rolesRepository.save(role);

        // Update permissions for the role
        rolePermissionRepository.deleteAllByRolesEntity(role);
        Set<Long> updatedPermissionIds = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                        .map(permission -> {
                            RolePermission rolePermission = new RolePermission();
                            rolePermission.setRolesEntity(role);
                            rolePermission.setPermissionEntity(permission); // Ensure this method exists in RolePermission
                            rolePermissionRepository.save(rolePermission);
                            return permission.getPermissionId();
                        })
                        .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + permissionId)))
                .collect(Collectors.toSet());

        return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), updatedPermissionIds);
    }

    // View role by ID
    public RoleDTO getRoleById(Long roleId) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        Set<Long> permissionIds = rolePermissionRepository.findByRolesEntity(role).stream()
                .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionId()) // Ensure this method exists in Permission
                .collect(Collectors.toSet());

        return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), permissionIds);
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
    public List<RoleDTO> getAllRoles() {
        List<RolesEntity> roles = rolesRepository.findAll();
        return roles.stream().map(role -> {
            Set<Long> permissionIds = rolePermissionRepository.findByRolesEntity(role).stream()
                    .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionId()) // Ensure this method exists in Permission
                    .collect(Collectors.toSet());

            return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), permissionIds);
        }).collect(Collectors.toList());


    }

    // Fetch permissions based on role names
    public Set<String> getPermissionsForRoles(List<String> roleNames) {
        // Fetch role entities using role names
        List<RolesEntity> roles = rolesRepository.findByRoleNameIn(roleNames);

        Set<String> permissionNames = new HashSet<>();

        // Loop through roles and get associated permissions
        for (RolesEntity role : roles) {
            Set<String> rolePermissionIds = rolePermissionRepository.findByRolesEntity(role).stream()
                    .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionName())
                    .collect(Collectors.toSet());

            // Add the permissions for each role to the overall set of permissions
            permissionNames.addAll(rolePermissionIds);
        }

        // Return the set of permissions (duplicates are already removed by the Set)
        return permissionNames;
    }



}
