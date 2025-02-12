package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementEntity.PermissionEntity;
import com.example.examManagementBackend.userManagement.userManagementDTO.PermissionDTO;
import com.example.examManagementBackend.userManagement.userManagementRepo.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PermissionService {


    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    // Fetch all permissions
    public List<PermissionDTO> getAllPermissions() {
        List<PermissionEntity> permissions = permissionRepository.findAll();
        return permissions.stream()
                .map(permission -> new PermissionDTO(
                        permission.getPermissionId(),
                        permission.getPermissionName(),
                        permission.getPermissionDescription(),
                        permission.getPermissionType()))
                .collect(Collectors.toList());
    }

    // Fetch a specific permission by ID
    public PermissionDTO getPermissionById(Long id) {
        PermissionEntity permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found with ID: " + id));
        return new PermissionDTO(
                permission.getPermissionId(),
                permission.getPermissionName(),
                permission.getPermissionDescription(),
                permission.getPermissionType());
    }

    // Fetch permissions by category
    public List<PermissionDTO> getPermissionsByCategory(String category) {
        List<PermissionEntity> permissions = permissionRepository.findByPermissionType(category);
        return permissions.stream()
                .map(permission -> new PermissionDTO(
                        permission.getPermissionId(),
                        permission.getPermissionName(),
                        permission.getPermissionDescription(),
                        permission.getPermissionType()))
                .collect(Collectors.toList());
    }
}
