package com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces;

import jakarta.servlet.http.HttpServletRequest;

public interface JwtService {
    public Object[] getUserNameAndToken(HttpServletRequest request);
}
