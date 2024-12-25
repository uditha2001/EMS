package com.example.examManagementBackend.userManagement.userManagementDTO;


public class LoginResponseDTO {
    private String Accesstoken;
    private String RequestToken;
    private UserDTO user;
    public LoginResponseDTO(String Accesstoken,String RequestToken,UserDTO user) {
        this.Accesstoken = Accesstoken;
        this.RequestToken = RequestToken;
        this.user = user;

    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getRequestToken() {
        return RequestToken;
    }

    public void setRequestToken(String requestToken) {
        RequestToken = requestToken;
    }

    public String getAccesstoken() {
        return Accesstoken;
    }

    public void setAccesstoken(String accesstoken) {
        this.Accesstoken = accesstoken;
    }



}
