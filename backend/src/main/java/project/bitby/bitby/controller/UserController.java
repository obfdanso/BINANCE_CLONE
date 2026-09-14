package project.bitby.bitby.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.ChangePasswordRequest;
import project.bitby.bitby.dto.ChangeUsernameRequest;
import project.bitby.bitby.dto.MessageResponse;
import project.bitby.bitby.service.UserService;
import project.bitby.bitby.security.JwtUtils;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Endpoint to change a user's username
     */
    @PostMapping("/change-username")
    public ResponseEntity<?> changeUsername(@Valid @RequestBody ChangeUsernameRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String authenticatedUsername = jwtUtils.getUsernameFromJwtToken(token);
        
        // Security check: only allow users to change their own username
        if (!authenticatedUsername.equals(request.getCurrentUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: You can only change your own username."));
        }
        
        return userService.changeUsername(request.getCurrentUsername(), request.getNewUsername());
    }
    
    /**
     * Endpoint to change a user's password
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String authenticatedUsername = jwtUtils.getUsernameFromJwtToken(token);
        
        // Security check: only allow users to change their own password
        if (!authenticatedUsername.equals(request.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: You can only change your own password."));
        }
        
        return userService.changePassword(
            request.getUsername(), 
            request.getCurrentPassword(), 
            request.getNewPassword()
        );
    }
}
