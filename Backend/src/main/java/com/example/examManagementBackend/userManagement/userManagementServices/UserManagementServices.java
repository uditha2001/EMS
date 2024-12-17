package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserRoleDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserManagementServices {
    @Autowired
    UserManagementRepo userManagementRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private UserRolesRepository userRolesRepo;
    @Autowired
    private RoleRepository roleRepository;

    public String saveUser(UserDTO user){
        UserEntity userEntity = new UserEntity(user.getUsername(),user.getEmail(),user.getFirstName(),user.getLastName(),0,true);
        userEntity.setPassword(getEncodePassword(user.getPassword()));
        userManagementRepo.save(userEntity);
        return "success";
    }

    public String getEncodePassword(String password){
        return passwordEncoder.encode(password);
    }

    public String saveUserWithRoles(UserRoleDTO userRoleDTO) {
        UserEntity userEntity = new UserEntity(
                userRoleDTO.getUsername(),
                userRoleDTO.getEmail(),
                userRoleDTO.getFirstName(),
                userRoleDTO.getLastName(),
                0,
                true
        );
        userEntity.setPassword(getEncodePassword(userRoleDTO.getPassword()));
        userManagementRepo.save(userEntity);

        // Save roles
        for (String roleName : userRoleDTO.getRoles()) {
            RolesEntity role = roleRepository.findByRoleName(roleName).orElseThrow(
                    () -> new RuntimeException("Role not found: " + roleName));
            UserRoles userRole = new UserRoles();
            userRole.setUser(userEntity);
            userRole.setRole(role);
            userRolesRepo.save(userRole);
        }

        return "User with roles created successfully";
    }

    // Assign a role to a user
    public void assignRoleToUser(Long userId, Long roleId) {
        UserEntity user = userManagementRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        RolesEntity role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role not found"));

        UserRoles userRole = new UserRoles();
        userRole.setUser(user);
        userRole.setRole(role);

        userRolesRepo.save(userRole);
    }

    public List<UserRoleDTO> getAllUsersWithRoles() {
        List<UserEntity> users = userManagementRepo.findAll();

        // Check if users list is not null or empty
        if (users == null || users.isEmpty()) {
            return List.of(); // Return an empty list
        }

        return users.stream()
                .map(user -> {
                    // Safely map user roles to role names
                    List<String> roles = user.getUserRoles().stream()
                            .map(userRole -> {
                                if (userRole != null && userRole.getRole() != null) {
                                    return userRole.getRole().getRoleName();
                                }
                                return null; // Handle null gracefully
                            })
                            .filter(roleName -> roleName != null) // Exclude null role names
                            .toList();

                    // Create and return UserRoleDTO
                    return new UserRoleDTO(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            roles
                    );
                })
                .toList();
    }



}
