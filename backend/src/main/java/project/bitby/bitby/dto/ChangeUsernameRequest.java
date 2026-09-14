package project.bitby.bitby.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangeUsernameRequest {
    @NotBlank(message = "Current username is required")
    private String currentUsername;
    
    @NotBlank(message = "New username is required")
    @Size(min = 3, max = 20, message = "New username must be between 3 and 20 characters")
    private String newUsername;
}
