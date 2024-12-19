package com.example.examManagementBackend.userManagement.userManagementDTO;

import java.util.Set;

public class UserProfileDTO {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String contactNo;
    private String bio;
    private String profileImage;
    private Set<String> roles; // List of roles assigned to the user

    // Constructor
    public UserProfileDTO(Long userId, String username, String email, String firstName, String lastName, String contactNo, String bio,
                          String profileImage, Set<String> roles) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNo = contactNo;
        this.bio = bio;
        this.profileImage = profileImage;
        this.roles = roles;
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }



    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public Set<String> getRoles() {
        return roles;
    }

}

