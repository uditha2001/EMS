package com.example.examManagementBackend.userManagement.userManagementController;

import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementServices.UserManagementServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public String addUser(@RequestBody UserDTO userdto) {
        String message=userService.saveUser(userdto);
        System.out.println(message);
        return message;
    }
    // Update user details
    @PutMapping(path="/updateUser/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable Long userId, @RequestBody UserDTO userdto) {
        String message = userService.updateUser(userId, userdto);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/addUserWithRoles")
    public String addUserWithRoles(@RequestBody UserDTO userDTO) {
        return userService.saveUserWithRoles(userDTO);
    }
    // Assign a role to a user
    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<String> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        userService.assignRoleToUser(userId, roleId);
        return ResponseEntity.ok("Role assigned successfully.");
    }

    // Get all users with roles
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsersWithRoles() {
        List<UserDTO> users = userService.getAllUsersWithRoles();
        return ResponseEntity.ok(users);
    }

    // Delete user by ID
    @DeleteMapping(path="/deleteUser/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        String message = userService.deleteUser(userId);
        return ResponseEntity.ok(message);
    }

    // Update user details with roles
    @PutMapping(path="/updateUserWithRoles/{userId}")
    public ResponseEntity<String> updateUserWithRoles(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        String message = userService.updateUserWithRoles(userId, userDTO);
        return ResponseEntity.ok(message);
    }

}
