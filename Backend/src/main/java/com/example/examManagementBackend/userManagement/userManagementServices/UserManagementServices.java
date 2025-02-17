package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces.MailService;
import com.example.examManagementBackend.userManagement.userManagementDTO.MailBody;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import com.example.examManagementBackend.utill.StandardResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class UserManagementServices {
    private final  UserManagementRepo userManagementRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRolesRepository userRolesRepo;
    private final RoleRepository roleRepository;
    private final MailService mailService;

    public UserManagementServices(UserManagementRepo userManagementRepo, PasswordEncoder passwordEncoder,UserRolesRepository userRolesRepo, RoleRepository roleRepository, MailService mailService) {
        this.userManagementRepo = userManagementRepo;
        this.passwordEncoder = passwordEncoder;
        this.userRolesRepo = userRolesRepo;
        this.roleRepository = roleRepository;
        this.mailService = mailService;
    }


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

      try{
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
          String subject="your ems password is "+userDTO.getPassword()+" and user name is "+userDTO.getUsername();
          String text="credentials for your EMS account";
          MailBody mailBody=new MailBody(
                  userDTO.getEmail(),
                  text,
                  subject
          );
          mailService.sendMail(mailBody);
          return "User with roles created successfully";

      }
      catch (Exception e){
          throw new RuntimeException(e.getMessage());
      }

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

        // Check if the user has the ADMIN role
//        boolean isAdmin = userEntity.getUserRoles().stream()
//                .anyMatch(userRole -> "ADMIN".equals(userRole.getRole().getRoleName()));
//
//        if (isAdmin) {
//            throw new RuntimeException("Cannot delete a user with the ADMIN role.");
//        }

        // Delete associated roles
        List<UserRoles> userRoles = userRolesRepo.findByUser(userEntity);
        userRolesRepo.deleteAll(userRoles);

        // Delete the user
        userManagementRepo.delete(userEntity);
        return "User deleted successfully";
    }

    public String updateUserWithRoles(Long userId, UserDTO userDTO) {
        UserEntity userEntity = userManagementRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user has the ADMIN role
//        boolean isAdmin = userEntity.getUserRoles().stream()
//                .anyMatch(userRole -> "ADMIN".equals(userRole.getRole().getRoleName()));
//
//        if (isAdmin) {
//            throw new RuntimeException("Cannot update a user with the ADMIN role.");
//        }

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
              userManagementRepo.updatePassword(username,newPassword);
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

    // Add Bulk Users with validation for existing users
    public void saveUsersWithRoles(List<UserDTO> users) {
        for (UserDTO userDTO : users) {
            // Check if the user already exists by username or email
            boolean existingUserByUsername = userManagementRepo.existsByUsername(userDTO.getUsername());
            Optional<UserEntity> existingUserByEmail = userManagementRepo.findByEmail(userDTO.getEmail());

            // If user exists by username or email, skip this user
            if (existingUserByUsername) {
                throw new RuntimeException("User with username " + userDTO.getUsername() + " already exists.");
            }
            if (existingUserByEmail.isPresent()) {
                throw new RuntimeException("User with email " + userDTO.getEmail() + " already exists.");
            }

            // Proceed to save new user if validation passes
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

            // Save roles for each user
            for (String roleName : userDTO.getRoles()) {
                RolesEntity role = roleRepository.findByRoleName(roleName)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                UserRoles userRole = new UserRoles();
                userRole.setUser(userEntity);
                userRole.setRole(role);
                userRolesRepo.save(userRole);
            }
        }
    }

//get all users count and each user count acording to their assign roles
    public ResponseEntity<StandardResponse> getAllUserCountWithRoles() {
        int totalUsersCount=0;
        Map<String,Integer> users=new LinkedHashMap<>();
        List<String> userRolesNames=roleRepository.getallRoles();
        List<UserEntity> allUsers = userManagementRepo.findAll();
        for(UserEntity user:allUsers){
            totalUsersCount++;
        }
        users.put("TOTAL",totalUsersCount);
        for(int i =0;i<userRolesNames.size();i++){
            int count=userRolesRepo.getNumberOfUsers(userRolesNames.get(i));
            users.put(userRolesNames.get(i)+"S",count);
        }
        return new ResponseEntity<>(
                new StandardResponse(200,"sucess",users), HttpStatus.OK
        );

    }

    public ResponseEntity<StandardResponse> getAllActiveUsers() {
        int activeUsers=userManagementRepo.getAllActiveUsers();
        return new ResponseEntity<>(
                new StandardResponse(200,"sucess",activeUsers), HttpStatus.OK
        );
    }

    @Scheduled(fixedRate = 86400000) // Runs once every 24 hours
    public void removeExpiredRoles() {
        List<UserRoles> allRoles = userRolesRepo.findAll();

        for (UserRoles userRole : allRoles) {
            if (userRole.isRoleExpired()) {
                userRolesRepo.delete(userRole); // Remove the expired role
            }
        }
    }
}
