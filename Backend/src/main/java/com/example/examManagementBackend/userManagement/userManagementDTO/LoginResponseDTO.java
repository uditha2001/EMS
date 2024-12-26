package com.example.examManagementBackend.userManagement.userManagementDTO;


public class LoginResponseDTO {
    private String accesstoken;
    private String refreshToken;
    private UserDTO user;
    public LoginResponseDTO(String Accesstoken, String refreshToken, UserDTO user) {
        this.accesstoken = Accesstoken;
        this.refreshToken = refreshToken;
        this.user = user;

    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getAccesstoken() {
        return accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.accesstoken = accesstoken;
    }



}
