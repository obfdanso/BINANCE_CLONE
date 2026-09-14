package project.bitby.bitby.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.bitby.bitby.dto.PasswordSetupRequest;
import project.bitby.bitby.models.User;
import project.bitby.bitby.dto.AuthResponse;
import project.bitby.bitby.security.JwtUtils;
import project.bitby.bitby.models.VerificationOtp;
import project.bitby.bitby.dto.MessageResponse;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.repository.VerificationOtpRepository;


import java.util.Optional;
import java.util.Random;
import java.time.LocalDateTime;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private OtpService otpService;
    
    
    @Autowired
    private VerificationOtpRepository verificationOtpRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private EmailService emailService;
    
    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }
    
        
    public String generateUniqueUsername() {
        // Generate a fun, memorable username with random elements
        String[] adjectives = {"happy", "sunny", "clever", "brave", "mighty", "cosmic", "dazzling", "golden", "silver", "brilliant",
    "zesty", "crafty", "nifty", "sneaky", "witty", "quirky", "fancy", "spicy", "bubbly", "jolly", "breezy" };

        String[] nouns = {"Eagle", "Tiger", "Panda", "Wizard", "Ninja", "Hero", "Ranger", "Phoenix", "Dragon", "Rider", "Fox", "Pirate", "Pixel", "Muffin", 
                 "Comet", "Jellyfish", "Lantern", "Gecko", "Cookie", "Frisbee", "Scooter", "Snowflake"  };
        
        Random random = new Random();
        String adjective = adjectives[random.nextInt(adjectives.length)];
        String noun = nouns[random.nextInt(nouns.length)];
        int number = 100 + random.nextInt(900); // 3-digit number
        
        String username = adjective + noun + number;
        
        // Check if the username is already taken, if so, generate a new one
        while (isUsernameTaken(username)) {
            adjective = adjectives[random.nextInt(adjectives.length)];
            noun = nouns[random.nextInt(nouns.length)];
            number = 100 + random.nextInt(900);
            username = adjective + noun + number;
        }
        
        return username;
    }
    
    public String generateUserId() {
        // Generate a 10-digit numeric ID
        Random random = new Random();
        StringBuilder idBuilder = new StringBuilder();
        
        // First digit can't be 0
        idBuilder.append(1 + random.nextInt(9));
        
        // Add 9 more random digits
        for (int i = 0; i < 9; i++) {
            idBuilder.append(random.nextInt(10));
        }
        
        return idBuilder.toString();
    }
    
    public User createUserWithVerifiedEmail(PasswordSetupRequest passwordRequest) {
        String email = passwordRequest.getEmail();
        
        // Verify that email is verified
        if (!otpService.isEmailVerified(email)) {
            throw new IllegalStateException("Email verification is incomplete");
        }
        
        // Create the user
        User user = new User();
        String username = generateUniqueUsername();
        String userId = generateUserId();
        
        user.setUsername(username);
        user.setUserId(userId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(passwordRequest.getPassword()));
        
        return userRepository.save(user);
    }
    
        
        
        
    private String generateRandomPassword() {
        // Generate a secure random password
        byte[] array = new byte[24];
        new Random().nextBytes(array);
        return new String(array, java.nio.charset.StandardCharsets.UTF_8);
    }
    
        
    /**
     * Change a user's username
     * @param currentUsername The current username
     * @param newUsername The new username
     * @return True if successful, false otherwise
     */
    public ResponseEntity<?> changeUsername(String currentUsername, String newUsername) {
        // Check if new username is already taken
        if (isUsernameTaken(newUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }
        
        // Find user by current username
        Optional<User> userOptional = userRepository.findByUsername(currentUsername);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Current username not found!"));
        }
        
        // Update username
        User user = userOptional.get();
        user.setUsername(newUsername);
        userRepository.save(user);
        
        // Generate new JWT with updated information
        String jwt = jwtUtils.generateJwtToken(user);
        
        return ResponseEntity.ok(new AuthResponse(
            jwt,
            user.getUserId(),
            user.getUsername(),
            "Username updated successfully!"
        ));
    }
    
    /**
     * Change a user's password
     * @param username The user's username
     * @param currentPassword The current password
     * @param newPassword The new password
     * @return True if successful, false otherwise
     */
    public ResponseEntity<?> changePassword(String username, String currentPassword, String newPassword) {
        // Find user by username
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username not found!"));
        }
        
        User user = userOptional.get();
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Current password is incorrect!"));
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Password updated successfully!"));
    }
    
        
    /**
     * Request password reset OTP
     * @param email The user's email
     * @return Response with success/error message
     */
    public ResponseEntity<?> requestPasswordReset(String email) {
        // Check if user exists with this email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: No user found with this email address!"));
        }
        
        // Generate password reset OTP
        VerificationOtp otpEntity = otpService.createPasswordResetOtp(email);
        
        // Send OTP via email
        emailService.sendPasswordResetOtpEmail(email, otpEntity.getOtp());
        
        return ResponseEntity.ok(new MessageResponse("Password reset OTP sent to your email. Please check your inbox and verify within 5 minutes."));
    }
    
    /**
     * Reset password with OTP verification
     * @param email The user's email
     * @param otp The OTP from email
     * @param newPassword The new password
     * @param confirmPassword The password confirmation
     * @return Response with success/error message
     */
    public ResponseEntity<?> resetPassword(String email, String otp, String newPassword, String confirmPassword) {
        // Validate password confirmation
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: New password and confirm password do not match!"));
        }
        
        // Verify OTP
        boolean isOtpValid = otpService.verifyPasswordResetOtp(email, otp);
        if (!isOtpValid) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid OTP or OTP expired!"));
        }
        
        // Find user by email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found!"));
        }
        
        // Update password
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(new MessageResponse("Password reset successfully! You can now login with your new password."));
    }
}
