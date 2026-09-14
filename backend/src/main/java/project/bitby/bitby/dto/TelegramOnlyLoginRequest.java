package project.bitby.bitby.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TelegramOnlyLoginRequest {
    @NotBlank(message = "Telegram username is required")
    private String telegramUsername;
}
