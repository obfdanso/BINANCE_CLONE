package project.bitby.bitby.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Bitby Verification OTP");
            message.setText("Your OTP for email verification is: " + otp + 
                    "\nThis OTP will expire in 60 seconds.");
            
            // Log OTP for testing purposes
            logger.info("DEV MODE - Email OTP for {}: {}", to, otp);
            
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    public void sendPasswordResetOtpEmail(String to, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Bitby Password Reset OTP");
            message.setText("Your OTP for password reset is: " + otp + 
                    "\nThis OTP will expire in 5 minutes." +
                    "\nIf you didn't request this password reset, please ignore this email.");
            
            // Log OTP for testing purposes
            logger.info("DEV MODE - Password Reset OTP for {}: {}", to, otp);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
