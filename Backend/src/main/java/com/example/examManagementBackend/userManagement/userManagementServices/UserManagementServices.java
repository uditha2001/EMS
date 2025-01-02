package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    public String saveUserWithRoles(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity(
                userDTO.getUsername(),
                userDTO.getEmail(),
                userDTO.getFirstName(),
                userDTO.getLastName(),
                0,
                true
        );
        userEntity.setPassword(getEncodePassword(userDTO.getPassword()));
        userManagementRepo.save(userEntity);

        // Save roles
        for (String roleName : userDTO.getRoles()) {
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

    public List<UserDTO> getAllUsersWithRoles() {
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
                    return new UserDTO(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            roles,
                            user.isActive()

                    );
                })
                .toList();
    }

    // Delete user by ID
    public String deleteUser(Long userId) {
        UserEntity userEntity = userManagementRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Delete associated roles
        List<UserRoles> userRoles = userRolesRepo.findByUser(userEntity);
        userRolesRepo.deleteAll(userRoles);

        // Delete the user
        userManagementRepo.delete(userEntity);
        return "User deleted successfully";
    }

    public String updateUserWithRoles(Long userId, UserDTO userDTO) {
        UserEntity userEntity = userManagementRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        userEntity.setUsername(userDTO.getUsername());
        userEntity.setEmail(userDTO.getEmail());
        userEntity.setFirstName(userDTO.getFirstName());
        userEntity.setLastName(userDTO.getLastName());

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            userEntity.setPassword(getEncodePassword(userDTO.getPassword()));
        }

        userManagementRepo.save(userEntity);

        userRolesRepo.deleteAll(userEntity.getUserRoles());

        for (String roleName : userDTO.getRoles()) {
            RolesEntity role = roleRepository.findByRoleName(roleName).orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            UserRoles userRole = new UserRoles();
            userRole.setUser(userEntity);
            userRole.setRole(role);
            userRolesRepo.save(userRole);
        }

        return "User with roles updated successfully";
    }

    public String updateUserStatus(Long userId, boolean isActive) {
        UserEntity userEntity = userManagementRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        userEntity.setActive(isActive); // Update the user's active status
        userManagementRepo.save(userEntity); // Save the updated user entity

        return "User status updated successfully";
    }

    public UserDTO getUserById(Long userId) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Safely map the UserEntity to a UserDTO
        List<String> roles = userEntity.getUserRoles().stream()
                .map(userRole -> {
                    if (userRole != null && userRole.getRole() != null) {
                        return userRole.getRole().getRoleName();
                    }
                    return null;
                })
                .filter(roleName -> roleName != null) // Exclude null role names
                .toList();

        // Create and return UserDTO
        return new UserDTO(
                userEntity.getUserId(),
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                roles,
                userEntity.isActive()
        );
    }
    public String updatePassword(String password,String username){
        UserEntity user=userManagementRepo.findByUsername(username);
        if(user!=null){
          try{
              String newPassword=getEncodePassword(password);
              userManagementRepo.updatePassword(newPassword,username);
              return "ok";
          }
          catch(Exception e){
              throw new RuntimeException("failed to update password");
          }

        }
        else{
            throw new UsernameNotFoundException("username not found");
        }
    }


}
