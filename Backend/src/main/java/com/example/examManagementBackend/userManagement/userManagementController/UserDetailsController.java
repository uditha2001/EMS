package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserRoleDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/v1/user")
public class UserDetailsController {
    @Autowired
    private UserManagementServices userService;
    //used to add a user

    @PostMapping(path="/addUser")
    @PreAuthorize("hasRole('ADMIN')")
    public String addUser(@RequestBody UserDTO userdto) {
        String message=userService.saveUser(userdto);
        System.out.println(message);
        return message;
    }
    @PutMapping(path="/updateUser")
    public String updateUser(@RequestBody UserDTO userdto) {
        return null;
    }

    @PostMapping("/addUserWithRoles")
    public String addUserWithRoles(@RequestBody UserRoleDTO userRoleDTO) {
        return userService.saveUserWithRoles(userRoleDTO);
    }
    // Assign a role to a user
    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<String> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        userService.assignRoleToUser(userId, roleId);
        return ResponseEntity.ok("Role assigned successfully.");
    }

    // Get all users with roles
    @GetMapping
    public ResponseEntity<List<UserRoleDTO>> getAllUsersWithRoles() {
        List<UserRoleDTO> users = userService.getAllUsersWithRoles();
        return ResponseEntity.ok(users);
    }

}
