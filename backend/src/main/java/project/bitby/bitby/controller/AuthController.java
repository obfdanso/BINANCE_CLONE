package project.bitby.bitby.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.*;
import project.bitby.bitby.models.User;
import project.bitby.bitby.models.VerificationOtp;
import project.bitby.bitby.security.JwtUtils;
import project.bitby.bitby.security.TokenBlacklist;  // Add this import statement
import project.bitby.bitby.security.UserDetailsImpl;
import project.bitby.bitby.service.EmailService;
import project.bitby.bitby.service.OtpService;
import project.bitby.bitby.service.TelegramBotService;
import project.bitby.bitby.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;
    
    @Autowired
    private OtpService otpService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private TelegramBotService telegramBotService;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    /**
     * Standard login endpoint using username/email and password
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail(), 
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                "Successfully authenticated!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid username/email or password!"));
        }
    }

    /**
     * Telegram login endpoint - Step 1: Request OTP
     */
    @PostMapping("/telegram/request-otp")
    public ResponseEntity<?> requestTelegramOtp(@RequestParam String telegramUsername) {
        return userService.generateTelegramLoginOtp(telegramUsername);
    }

    /**
     * Telegram login endpoint - Step 2: Verify OTP and authenticate
     */
    @PostMapping("/telegram/login")
    public ResponseEntity<?> authenticateWithTelegram(@Valid @RequestBody TelegramLoginRequest request) {
        return userService.authenticateWithTelegramOtp(request.getTelegramUsername(), request.getOtp());
    }

    // Step 1: Request email verification
    @PostMapping("/signup/email")
    public ResponseEntity<?> requestEmailVerification(@Valid @RequestBody EmailVerificationRequest request) {
        String email = request.getEmail();
        
        if (userService.isEmailTaken(email)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Generate OTP and save
        VerificationOtp otpEntity = otpService.createEmailOtp(email);
        
        // Send OTP via email
        emailService.sendOtpEmail(email, otpEntity.getOtp());
        
        return ResponseEntity.ok(new MessageResponse("OTP sent to your email. Please verify within 5 minutes."));
    }
    
    // Step 2: Verify email with OTP
    @PostMapping("/signup/verify-email")
    public ResponseEntity<?> verifyEmail(@Valid @RequestBody OtpVerificationRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        
        boolean isVerified = otpService.verifyEmailOtp(email, otp);
        if (!isVerified) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid OTP or OTP expired!"));
        }
        
        return ResponseEntity.ok(new MessageResponse("Email verified successfully. Please set your password to complete registration."));
    }
    
    // Step 3: Complete registration by setting password
    @PostMapping("/signup/complete")
    public ResponseEntity<?> completeRegistration(@Valid @RequestBody PasswordSetupRequest request) {
        String email = request.getEmail();
        
        // Verify that email is verified
        if (!otpService.isEmailVerified(email)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Please verify your email first!"));
        }
        
        try {
            // Create the user with verified email
            User user = userService.createUserWithVerifiedEmail(request);
            
            return ResponseEntity.ok(new MessageResponse(
                "User registered successfully! Your username is: " + user.getUsername() + " and your ID is: " + user.getUserId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // TELEGRAM AUTHENTICATION ENDPOINTS
    
    // Step 1: Request Telegram verification
    @PostMapping("/signup/telegram")
    public ResponseEntity<?> requestTelegramVerification(@Valid @RequestBody TelegramVerificationRequest request) {
        String email = request.getEmail();
        String telegramUsername = request.getTelegramUsername();
        
        if (userService.isEmailTaken(email)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }
        
        // Check if the user has interacted with our bot
        if (!telegramBotService.isUserRegisteredWithBot(telegramUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Please start a chat with our Telegram bot @BitbyBot first!"));
        }
        
        // Send OTP via Telegram
        boolean sent = telegramBotService.sendOtpMessage(telegramUsername, email);
        
        if (!sent) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error: Failed to send OTP via Telegram. Please try again."));
        }
        
        return ResponseEntity.ok(new MessageResponse("OTP sent to your Telegram account. Please verify within 5 minutes."));
    }
    
    // Step 2: Verify Telegram with OTP
    @PostMapping("/signup/verify-telegram")
    public ResponseEntity<?> verifyTelegram(@Valid @RequestBody TelegramOtpVerificationRequest request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        
        boolean isVerified = telegramBotService.verifyTelegramOtp(email, otp);
        if (!isVerified) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid OTP or OTP expired!"));
        }
        
        return ResponseEntity.ok(new MessageResponse("Telegram verified successfully. Please set your password to complete registration."));
    }
    
    // Step 3: Complete registration with Telegram by setting password
    @PostMapping("/signup/complete-telegram")
    public ResponseEntity<?> completeTelegramRegistration(@Valid @RequestBody PasswordSetupRequest request) {
        String email = request.getEmail();
        
        // Get telegram username and check verification
        String telegramUsername = telegramBotService.getTelegramUsername(email);
        if (telegramUsername == null) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Please verify your Telegram account first!"));
        }
        
        try {
            // Create the user with verified telegram
            User user = userService.createUserWithVerifiedTelegram(request);
            
            return ResponseEntity.ok(new MessageResponse(
                "User registered successfully with Telegram! Your username is: " + user.getUsername() + 
                " and your ID is: " + user.getUserId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Step 1: Pure Telegram signup without email
    @PostMapping("/signup/telegram-only")
    public ResponseEntity<?> requestTelegramOnlySignup(@Valid @RequestBody TelegramOnlySignupRequest request) {
        String telegramUsername = request.getTelegramUsername();
        
        // Check if the user has interacted with our bot
        if (!telegramBotService.isUserRegisteredWithBot(telegramUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Please start a chat with our Telegram bot @BitbyBot first!"));
        }
        
        // Check if telegram username is already registered
        if (userService.isTelegramUsernameTaken(telegramUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: This Telegram account is already registered!"));
        }
        
        // Send OTP via Telegram (you'll need to modify this method to not require email)
        boolean sent = telegramBotService.sendTelegramOnlyOtp(telegramUsername);
        
        if (!sent) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error: Failed to send OTP via Telegram. Please try again."));
        }
        
        return ResponseEntity.ok(new MessageResponse("OTP sent to your Telegram account. Please verify within 5 minutes."));
    }
    
    // Step 2: Verify Telegram-only with OTP
    @PostMapping("/signup/verify-telegram-only")
    public ResponseEntity<?> verifyTelegramOnly(@Valid @RequestBody TelegramOnlyOtpVerificationRequest request) {
        String telegramUsername = request.getTelegramUsername();
        String otp = request.getOtp();
        
        boolean isVerified = telegramBotService.verifyTelegramOnlyOtp(telegramUsername, otp);
        if (!isVerified) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid OTP or OTP expired!"));
        }
        
        // Create the user with only Telegram verification
        try {
            User user = userService.createUserWithTelegramOnly(telegramUsername);
            
            return ResponseEntity.ok(new MessageResponse(
                "User registered successfully with Telegram! Your username is: " + user.getUsername() + 
                " and your ID is: " + user.getUserId()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Login endpoint for Telegram-only users
    @PostMapping("/login/telegram")
    public ResponseEntity<?> telegramLogin(@Valid @RequestBody TelegramOnlyLoginRequest request) {
        String telegramUsername = request.getTelegramUsername();
        
        // Verify user exists
        if (!userService.existsByTelegramUsername(telegramUsername)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Telegram account not found!"));
        }
        
        // Generate OTP and send to Telegram for login verification
        // We'll use the UserService method that handles both generation and sending
        return userService.generateTelegramLoginOtp(telegramUsername);
    }
    
    // Verify Telegram login OTP
    @PostMapping("/login/verify-telegram")
    public ResponseEntity<?> verifyTelegramLogin(@Valid @RequestBody TelegramOnlyOtpVerificationRequest request) {
        String telegramUsername = request.getTelegramUsername();
        String otp = request.getOtp();
        
        // Authenticate user with Telegram OTP
        // Return authentication token if successful
        // This will need to be implemented in a service
        return userService.authenticateWithTelegramOtp(telegramUsername, otp);
    }

    // Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String authHeader) {
        // Extract token from Bearer header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Get remaining expiry time from JWT
            long expiryTime = jwtUtils.getExpiryDurationFromToken(token);
            
            // Add to blacklist
            tokenBlacklist.blacklistToken(token, expiryTime);
            
            return ResponseEntity.ok(new MessageResponse("Logout successful"));
        }
        
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid token"));
    }
    
    /**
     * Forgot Password - Step 1: Request password reset OTP
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return userService.requestPasswordReset(request.getEmail());
    }
    
    /**
     * Forgot Password - Step 2: Reset password with OTP verification
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return userService.resetPassword(
            request.getEmail(), 
            request.getOtp(), 
            request.getNewPassword(), 
            request.getConfirmPassword()
        );
    }
}
