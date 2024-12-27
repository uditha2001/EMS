package com.example.examManagementBackend.userManagement.userManagementDTO;


public class LoginResponseDTO {
    private String accesstoken;
    private UserDTO user;
    public LoginResponseDTO(String Accesstoken,UserDTO user) {
        this.accesstoken = Accesstoken;
        this.user = user;

    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }


    public String getAccesstoken() {
        return accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.accesstoken = accesstoken;
    }



}
