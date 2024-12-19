package com.example.examManagementBackend.userManagement.userManagementServices;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserProfileDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserProfileServices {

    @Autowired
    UserManagementRepo userManagementRepo;
    // Inject your storage path for profile images (can be a directory or cloud service)
    @Value("${profile.image.upload-dir}")
    private String uploadDir;

    // Existing method to update user profile info (name, email, contact, bio)
    public String updateUserProfile(Long userId, UserProfileDTO updatedProfile) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update name, email, contact, bio
        userEntity.setEmail(updatedProfile.getEmail());
        userEntity.setFirstName(updatedProfile.getFirstName());
        userEntity.setLastName(updatedProfile.getLastName());
        userEntity.setContactNo(updatedProfile.getContactNo());
        userEntity.setBio(updatedProfile.getBio());

        userManagementRepo.save(userEntity);

        return "User profile updated successfully";
    }

    // Update user profile image
//    public String updateUserProfileImage(Long userId, MultipartFile imageFile) {
//        UserEntity userEntity = userManagementRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        try {
//            // Check if the image is not empty
//            if (!imageFile.isEmpty()) {
//                // Save the image to the designated directory
//                Path path = Paths.get(uploadDir + userId + "_" + imageFile.getOriginalFilename());
//                Files.write(path, imageFile.getBytes());
//
//                // Update the user's profile image path in the database
//                userEntity.setProfileImage(path.toString());
//                userManagementRepo.save(userEntity);
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to upload profile image: " + e.getMessage());
//        }
//
//        return "Profile image updated successfully";
//    }
//
//    // Delete user profile image
//    public String deleteUserProfileImage(Long userId) {
//        UserEntity userEntity = userManagementRepo.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Check if the user has a profile image and delete it
//        if (userEntity.getProfileImage() != null) {
//            try {
//                Path imagePath = Paths.get(userEntity.getProfileImage());
//                Files.delete(imagePath); // Delete the file from the file system
//                userEntity.setProfileImage(null); // Remove the image path from the database
//                userManagementRepo.save(userEntity);
//            } catch (Exception e) {
//                throw new RuntimeException("Failed to delete profile image: " + e.getMessage());
//            }
//        }
//
//        return "Profile image deleted successfully";
//    }
    public UserProfileDTO getUserProfile(Long userId) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = userEntity.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getRoleName())
                .collect(Collectors.toSet());

        return new UserProfileDTO(
                userEntity.getUserId(),
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                userEntity.getContactNo(),
                userEntity.getBio(),
                userEntity.getProfileImage(),
                roles
        );
    }
}

