package project.bitby.bitby.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TelegramLoginRequest {
    @NotBlank(message = "Telegram username is required")
    private String telegramUsername;
    
    @NotBlank(message = "OTP is required")
    private String otp;
}
