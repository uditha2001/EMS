package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.RoleDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolePermission;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleService {


    private final RoleRepository rolesRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository rolesRepository, RolePermissionRepository rolePermissionRepository,PermissionRepository permissionRepository) {
        this.rolesRepository = rolesRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
    }

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

        return new RoleDTO(savedRole.getRoleId(), savedRole.getRoleName(), savedRole.getRoleDescription(), assignedPermissionIds,savedRole.isProtected());
    }

    // Update role
    @Transactional
    public RoleDTO updateRole(Long roleId, String roleName, String roleDescription, Set<Long> permissionIds) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

//        if (role.isProtected()) {
//            throw new RuntimeException("Cannot update seeded role");
//        }

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

        return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), updatedPermissionIds,role.isProtected());
    }

    // View role by ID
    public RoleDTO getRoleById(Long roleId) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        Set<Long> permissionIds = rolePermissionRepository.findByRolesEntity(role).stream()
                .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionId()) // Ensure this method exists in Permission
                .collect(Collectors.toSet());

        return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), permissionIds, role.isProtected());
    }

    // Delete role
    @Transactional
    public void deleteRole(Long roleId) {
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + roleId));

        // Check if the role is a seeded role, prevent deletion if true
        if (role.isProtected()) {
            throw new RuntimeException("Cannot delete a seeded role");
        }

        // Delete all role permissions associated with this role
        rolePermissionRepository.deleteAllByRolesEntity(role);

        // Delete the role
        rolesRepository.delete(role);
    }


    // Get all roles
    public List<RoleDTO> getAllRoles() {
        List<RolesEntity> roles = rolesRepository.findAll();
        return roles.stream().map(role -> {
            Set<Long> permissionIds = rolePermissionRepository.findByRolesEntity(role).stream()
                    .map(rolePermission -> rolePermission.getPermissionEntity().getPermissionId()) // Ensure this method exists in Permission
                    .collect(Collectors.toSet());

            return new RoleDTO(role.getRoleId(),role.getRoleName(), role.getRoleDescription(), permissionIds,role.isProtected());
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

    public List<RoleDTO> getAllRolesWithoutPermissions() {
        List<RolesEntity> roles = rolesRepository.findAll();
        return roles.stream().map(role -> {
            // Only create RoleDTO without permissionIds
            return new RoleDTO(role.getRoleId(), role.getRoleName(), role.getRoleDescription(), null, role.isProtected());
        }).collect(Collectors.toList());
    }

    // Method to get roles with specific names
    public List<RoleDTO> getSpecificRoles() {
        // List of specific role names you want to fetch
        List<String> roleNames = Arrays.asList("PAPER_CREATOR", "PAPER_MODERATOR", "FIRST_MAKER", "SECOND_MAKER");

        // Fetch roles by name
        List<RolesEntity> roles = rolesRepository.findByRoleNameIn(roleNames);

        // Map roles to DTOs without permissions
        return roles.stream().map(role -> {
            return new RoleDTO(role.getRoleId(), role.getRoleName(), role.getRoleDescription(), null, role.isProtected());
        }).collect(Collectors.toList());
    }


}
