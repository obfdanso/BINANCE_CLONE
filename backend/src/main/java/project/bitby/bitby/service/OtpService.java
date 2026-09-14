package project.bitby.bitby.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.bitby.bitby.models.VerificationOtp;
import project.bitby.bitby.repository.VerificationOtpRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    @Autowired
    private VerificationOtpRepository verificationOtpRepository;
    
    // Generate a random 6-digit OTP
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    
    // Create or update email OTP
    public VerificationOtp createEmailOtp(String email) {
        Optional<VerificationOtp> existingOtp = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.EMAIL);
        
        VerificationOtp otpEntity;
        if (existingOtp.isPresent()) {
            otpEntity = existingOtp.get();
        } else {
            otpEntity = new VerificationOtp();
            otpEntity.setEmail(email);
            otpEntity.setVerificationType(VerificationOtp.VerificationType.EMAIL);
        }
        
        otpEntity.setOtp(generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // Increased to 5 minutes for better UX
        otpEntity.setVerified(false);
        
        return verificationOtpRepository.save(otpEntity);
    }
    
    // Verify email OTP
    public boolean verifyEmailOtp(String email, String otp) {
        logger.info("Attempting to verify email OTP for: {}", email);
        
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.EMAIL);
        
        if (otpEntityOpt.isEmpty()) {
            logger.error("No OTP record found for email: {}", email);
            return false;
        }
        
        VerificationOtp otpEntity = otpEntityOpt.get();
        logger.info("Found OTP record: expiry={}, storedOTP={}, inputOTP={}", 
                otpEntity.getExpiryTime(), otpEntity.getOtp(), otp);
                
        if (otpEntity.isExpired()) {
            logger.error("OTP is expired for email: {}", email);
            return false;
        }
        
        if (!otpEntity.getOtp().equals(otp)) {
            logger.error("OTP mismatch for email: {}. Expected: {}, Received: {}", 
                    email, otpEntity.getOtp(), otp);
            return false;
        }
        
        otpEntity.setVerified(true);
        verificationOtpRepository.save(otpEntity);
        logger.info("Email verification successful for: {}", email);
        return true;
    }
    
    // Check if email is verified
    public boolean isEmailVerified(String email) {
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.EMAIL);
        return otpEntityOpt.isPresent() && otpEntityOpt.get().isVerified();
    }
    
    // Create or update password reset OTP
    public VerificationOtp createPasswordResetOtp(String email) {
        Optional<VerificationOtp> existingOtp = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.PASSWORD_RESET);
        
        VerificationOtp otpEntity;
        if (existingOtp.isPresent()) {
            otpEntity = existingOtp.get();
        } else {
            otpEntity = new VerificationOtp();
            otpEntity.setEmail(email);
            otpEntity.setVerificationType(VerificationOtp.VerificationType.PASSWORD_RESET);
        }
        
        otpEntity.setOtp(generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // 5 minutes expiry
        otpEntity.setVerified(false);
        
        return verificationOtpRepository.save(otpEntity);
    }
    
    // Verify password reset OTP
    public boolean verifyPasswordResetOtp(String email, String otp) {
        logger.info("Attempting to verify password reset OTP for: {}", email);
        
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.PASSWORD_RESET);
        
        if (otpEntityOpt.isEmpty()) {
            logger.error("No password reset OTP record found for email: {}", email);
            return false;
        }
        
        VerificationOtp otpEntity = otpEntityOpt.get();
        logger.info("Found password reset OTP record: expiry={}, storedOTP={}, inputOTP={}", 
                otpEntity.getExpiryTime(), otpEntity.getOtp(), otp);
                
        if (otpEntity.isExpired()) {
            logger.error("Password reset OTP is expired for email: {}", email);
            return false;
        }
        
        if (!otpEntity.getOtp().equals(otp)) {
            logger.error("Password reset OTP mismatch for email: {}. Expected: {}, Received: {}", 
                    email, otpEntity.getOtp(), otp);
            return false;
        }
        
        otpEntity.setVerified(true);
        verificationOtpRepository.save(otpEntity);
        logger.info("Password reset verification successful for: {}", email);
        return true;
    }
}
