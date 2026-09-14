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
    private TelegramBotService telegramBotService;
    
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
    
    public boolean isTelegramUsernameTaken(String telegramUsername) {
        return userRepository.existsByTelegramUsername(telegramUsername);
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
    
    public User createUserWithVerifiedTelegram(PasswordSetupRequest passwordRequest) {
        String email = passwordRequest.getEmail();
        
        // Verify that telegram is verified
        String telegramUsername = telegramBotService.getTelegramUsername(email);
        if (telegramUsername == null) {
            throw new IllegalStateException("Telegram verification is incomplete");
        }
        
        // Create the user
        User user = new User();
        // Use telegram username as app username instead of generating a random one
        String username = telegramUsername;
        // If telegram username is already taken as an app username, add a suffix
        if (isUsernameTaken(username)) {
            int suffix = 1;
            while (isUsernameTaken(username + suffix)) {
                suffix++;
            }
            username = username + suffix;
        }
        
        String userId = generateUserId();
        
        user.setUsername(username);
        user.setUserId(userId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(passwordRequest.getPassword()));
        user.setTelegramUsername(telegramUsername);
        
        return userRepository.save(user);
    }
    
    public boolean existsByTelegramUsername(String telegramUsername) {
        return userRepository.existsByTelegramUsername(telegramUsername);
    }
    
    public User createUserWithTelegramOnly(String telegramUsername) {
        // Create a new user with only Telegram authentication
        User user = new User();
        
        // Use telegram username as app username instead of generating a random one
        String username = telegramUsername;
        // If telegram username is already taken as an app username, add a suffix
        if (isUsernameTaken(username)) {
            int suffix = 1;
            while (isUsernameTaken(username + suffix)) {
                suffix++;
            }
            username = username + suffix;
        }
        
        String userId = generateUserId();
        
        user.setUsername(username);
        user.setUserId(userId);
        user.setTelegramUsername(telegramUsername);
        // No email required
        // Generate a random password that won't be used for login
        user.setPassword(passwordEncoder.encode(generateRandomPassword()));
        
        return userRepository.save(user);
    }
    
    private String generateRandomPassword() {
        // Generate a secure random password
        byte[] array = new byte[24];
        new Random().nextBytes(array);
        return new String(array, java.nio.charset.StandardCharsets.UTF_8);
    }
    
    public ResponseEntity<?> authenticateWithTelegramOtp(String telegramUsername, String otp) {
        // Verify OTP
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByTelegramUsernameAndVerificationType(
                telegramUsername, VerificationOtp.VerificationType.TELEGRAM_LOGIN);
        
        if (otpEntityOpt.isEmpty() || !otpEntityOpt.get().getOtp().equals(otp) || otpEntityOpt.get().isExpired()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid OTP or expired!"));
        }
        
        // Find user by Telegram username
        Optional<User> userOpt = userRepository.findByTelegramUsername(telegramUsername);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not found!"));
        }
        
        // Generate JWT token
        User user = userOpt.get();
        // Mark OTP as used
        VerificationOtp otpEntity = otpEntityOpt.get();
        otpEntity.setVerified(true);
        verificationOtpRepository.save(otpEntity);
        
        // Generate and return JWT token
        String jwt = jwtUtils.generateJwtToken(user);
        
        return ResponseEntity.ok(new AuthResponse(
            jwt,
            user.getUserId(),
            user.getUsername(),
            "Successfully authenticated via Telegram!"
        ));
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
     * Generate OTP for Telegram login
     * @param telegramUsername The user's Telegram username
     * @return Response with success/error message
     */
    public ResponseEntity<?> generateTelegramLoginOtp(String telegramUsername) {
        // Verify that a user with this Telegram username exists
        Optional<User> userOpt = userRepository.findByTelegramUsername(telegramUsername);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: No user found with this Telegram username!"));
        }
        
        // Generate a random 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        
        // Save OTP to database
        VerificationOtp otpEntity = new VerificationOtp();
        otpEntity.setTelegramUsername(telegramUsername);
        otpEntity.setOtp(otp);
        otpEntity.setVerificationType(VerificationOtp.VerificationType.TELEGRAM_LOGIN);
        // Using expiryTime from VerificationOtp class with LocalDateTime
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // 5 minutes expiry
        verificationOtpRepository.save(otpEntity);
        
        // Send OTP via Telegram bot - passing both username and OTP
        boolean sent = telegramBotService.sendLoginOtp(telegramUsername, otp);
        if (!sent) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Failed to send OTP via Telegram."));
        }
        
        return ResponseEntity.ok(new MessageResponse("OTP sent successfully! Please check your Telegram."));
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
