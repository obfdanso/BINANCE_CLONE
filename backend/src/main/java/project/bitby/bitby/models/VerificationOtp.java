package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "verification_otps")
@NoArgsConstructor
@AllArgsConstructor
public class VerificationOtp {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    
    private String mobileNumber;
    
    private String telegramUsername;
    
    private String otp;
    
    @Enumerated(EnumType.STRING)
    private VerificationType verificationType;
    
    private LocalDateTime expiryTime;
    
    private boolean verified;
    
    public enum VerificationType {
        EMAIL,
        TELEGRAM,
        TELEGRAM_LOGIN,
        PASSWORD_RESET
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}