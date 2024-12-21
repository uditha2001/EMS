package com.example.examManagementBackend.userManagement.userManagementServices;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserProfileDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public String updateUserProfileImage(Long userId, MultipartFile imageFile) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (imageFile.isEmpty()) {
            throw new IllegalArgumentException("Uploaded image file is empty");
        }

        String contentType = imageFile.getContentType();
        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Uploaded file is not a valid image");
        }

        try {
            String sanitizedFileName = Paths.get(imageFile.getOriginalFilename())
                    .getFileName().toString()
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetPath = Paths.get(uploadDir).resolve(userId + "_" + sanitizedFileName);

            Files.createDirectories(targetPath.getParent());
            Files.write(targetPath, imageFile.getBytes());

            userEntity.setProfileImage(targetPath.toString());
            userManagementRepo.save(userEntity);

            return "Profile image updated successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image: " + e.getMessage(), e);
        }
    }

    // Delete user profile image
    public String deleteUserProfileImage(Long userId) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String profileImagePath = userEntity.getProfileImage();

        if (profileImagePath == null || profileImagePath.isEmpty()) {
            throw new IllegalStateException("No profile image found for this user");
        }

        try {
            Path imagePath = Paths.get(profileImagePath);
            if (!Files.exists(imagePath)) {
                return "Profile image does not exist; nothing to delete.";
            }

            Files.delete(imagePath);

            userEntity.setProfileImage(null);
            userManagementRepo.save(userEntity);

            return "Profile image deleted successfully";
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete profile image: " + e.getMessage(), e);
        }
    }

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

    public ResponseEntity<byte[]> getUserProfileImage(Long userId) {
        UserEntity userEntity = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String profileImagePath = userEntity.getProfileImage();

        if (StringUtils.isEmpty(profileImagePath)) {
            throw new RuntimeException("No profile image found for this user");
        }

        try {
            Path imagePath = Paths.get(profileImagePath);

            // Check if the file exists
            if (!Files.exists(imagePath)) {
                throw new RuntimeException("Profile image file not found on disk");
            }

            // Read the image file as bytes
            byte[] imageBytes = Files.readAllBytes(imagePath);

            // Set response headers to indicate the file type (optional)
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(imagePath));

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load profile image: " + e.getMessage(), e);
        }
    }
}

