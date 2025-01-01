package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.MailBody;
import com.example.examManagementBackend.userManagement.userManagementEntity.ForgotPasswordEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.ForgotPasswordRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Random;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String mailProvider;
    @Autowired
    UserManagementRepo userManagementRepo;
    @Autowired
    ForgotPasswordRepo forgotPasswordRepo;
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendMail(MailBody mailBody) {
        try {
            if (mailBody.to() == null || mailBody.to().isEmpty()) {
                throw new IllegalArgumentException("Recipient email address cannot be null or empty.");
            }
            if (mailBody.subject() == null || mailBody.subject().isEmpty()) {
                throw new IllegalArgumentException("Email subject cannot be null or empty.");
            }
            if (mailBody.text() == null || mailBody.text().isEmpty()) {
                throw new IllegalArgumentException("Email body cannot be null or empty.");
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(mailBody.to());
            message.setFrom(mailProvider);
            message.setSubject(mailBody.subject());
            message.setText(mailBody.text());

            mailSender.send(message);

            System.out.println("Email sent successfully to " + mailBody.to());
        } catch (Exception e) {
            // Log or handle exceptions
            System.err.println("Failed to send email: " + e.getMessage());
        }
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
                ForgotPasswordEntity forgotPasswordEntity=forgotPasswordRepo.getdatabyUser(userName);
                if(forgotPasswordEntity==null) {
                    forgotPasswordEntity=new ForgotPasswordEntity(
                            otp,
                            new Date(System.currentTimeMillis()+60*1000),
                            userEntity
                    );
                    forgotPasswordRepo.save(forgotPasswordEntity);
                }
                else{
                    forgotPasswordRepo.deletedatabyUser(userName);
                    forgotPasswordRepo.save(forgotPasswordEntity);
                }

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
        return random.nextInt(100000,999999);
    }
//verify the otp
    public String verifyOtp(Integer otp,String username) {
        ForgotPasswordEntity forgotPasswordEntity=forgotPasswordRepo.getdatabyUser(username);
        if(forgotPasswordEntity!=null) {
            if(forgotPasswordEntity.getOtp()!=null && forgotPasswordEntity.getOtp().equals(otp)) {
                    if(forgotPasswordEntity.getExpirationDate().before(Date.from(Instant.now()))){
                        forgotPasswordRepo.delete(forgotPasswordEntity);
                        return "otp expired";
                    }
                    else{
                        forgotPasswordRepo.delete(forgotPasswordEntity);
                        return "ok";
                    }
                }
                else{
                    forgotPasswordRepo.delete(forgotPasswordEntity);
                    return "404";
                }
            }
        else{
            return "user not exist";
        }
    }
}
