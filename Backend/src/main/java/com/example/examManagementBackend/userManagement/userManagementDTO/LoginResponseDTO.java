package com.example.examManagementBackend.userManagement.userManagementDTO;


public class LoginResponseDTO {
    private String Accesstoken;
    private String RequestToken;
    public LoginResponseDTO(String Accesstoken,String RequestToken) {
        this.Accesstoken = Accesstoken;
        this.RequestToken = RequestToken;

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
