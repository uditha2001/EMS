package com.example.examManagementBackend.userManagement.userManagementServices.serviceInterfaces;

import com.example.examManagementBackend.userManagement.userManagementDTO.MailBody;

public interface MailService {
    public String sendMail(MailBody mailBody);
}
