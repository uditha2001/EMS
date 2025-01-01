package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.MailBody;
import com.example.examManagementBackend.userManagement.userManagementEntity.ForgotPasswordEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.ForgotPasswordRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    @Autowired
    UserManagementRepo userManagementRepo;
    @Autowired
    ForgotPasswordRepo forgotPasswordRepo;
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMail(MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());
        mailSender.send(message);
    }
   //verify the username for get his mail
    public String verifyUserMail(String userName) {
        UserEntity userEntity=userManagementRepo.findByUsername(userName);
        if(userEntity!=null) {
            if(userEntity.getEmail()!=null) {
                String Email=userEntity.getEmail();
                Integer otp=otpGenerator();
                String subject="this is otp for your forgot password request "+otp;
                String text="otp for forgot password request ";
                MailBody mailBody=new MailBody(
                        Email,
                       subject,
                        text
                );
                ForgotPasswordEntity forgotPasswordEntity=new ForgotPasswordEntity(
                        otp,
                        new Date(System.currentTimeMillis()+60*1000),
                        userEntity
                );
                forgotPasswordRepo.save(forgotPasswordEntity);
                sendMail(mailBody);
                return "ok";
            }
            else{
                return "email not exist";
            }
        }
        else{
            return "user not exist";
        }
    }
    private Integer otpGenerator(){
        Random random=new Random();
        return random.nextInt(1000000,999999);
    }

}
