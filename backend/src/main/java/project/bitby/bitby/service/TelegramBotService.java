package project.bitby.bitby.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import project.bitby.bitby.models.VerificationOtp;
import project.bitby.bitby.repository.VerificationOtpRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TelegramBotService extends TelegramLongPollingBot {
    
    private static final Logger logger = LoggerFactory.getLogger(TelegramBotService.class);
    
    private final String botUsername;
    
    @Autowired
    private OtpService otpService;
    
    @Autowired
    private VerificationOtpRepository verificationOtpRepository;
    
    // Store chat IDs by telegram username
    private final Map<String, Long> userChatIds = new ConcurrentHashMap<>();
    
    // Store temporary verification state
    private final Map<String, String> pendingVerifications = new ConcurrentHashMap<>();

    public TelegramBotService(String botUsername, String botToken) {
        super(botToken);
        this.botUsername = botUsername;
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();
            String username = update.getMessage().getFrom().getUserName();
            
            // Store the chat ID for the user
            if (username != null) {
                userChatIds.put(username, chatId);
            }
            
            // Check if this is a start command with a verification code parameter
            if (messageText.startsWith("/start ")) {
                String verificationCode = messageText.substring(7).trim();
                processVerificationCode(username, verificationCode, chatId);
            } 
            // Process regular commands
            else if (messageText.equals("/start")) {
                sendWelcomeMessage(chatId);
            }
        }
    }
    
    private void processVerificationCode(String username, String verificationCode, long chatId) {
        // Link this verification code to the telegram username
        pendingVerifications.put(verificationCode, username);
        
        // Send confirmation
        sendTextMessage(chatId, "Your account is now being verified. You can continue the signup process in the app.");
    }
    
    private void sendWelcomeMessage(long chatId) {
        sendTextMessage(chatId, "Welcome to Bitby Bot! This bot helps you verify your account for the Bitby application.");
    }
    
    public boolean sendOtpMessage(String telegramUsername, String email) {
        Long chatId = userChatIds.get(telegramUsername);
        if (chatId == null) {
            logger.error("No chat ID found for Telegram username: {}", telegramUsername);
            return false;
        }
        
        // Generate OTP and save
        VerificationOtp otpEntity = createTelegramOtp(email, telegramUsername);
        
        // Send OTP via telegram
        String message = "Your OTP for Bitby account verification is: " + otpEntity.getOtp() + 
                "\nThis OTP will expire in 5 minutes.";
        
        try {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(chatId);
            sendMessage.setText(message);
            execute(sendMessage);
            return true;
        } catch (TelegramApiException e) {
            logger.error("Failed to send OTP via Telegram: {}", e.getMessage(), e);
            return false;
        }
    }
    
    public boolean sendTelegramOnlyOtp(String telegramUsername) {
        Long chatId = userChatIds.get(telegramUsername);
        if (chatId == null) {
            logger.error("No chat ID found for Telegram username: {}", telegramUsername);
            return false;
        }
        
        // Generate OTP for Telegram-only verification
        VerificationOtp otpEntity = createTelegramOnlyOtp(telegramUsername);
        
        // Send OTP via telegram
        String message = "Your OTP for Bitby account verification is: " + otpEntity.getOtp() + 
                "\nThis OTP will expire in 5 minutes.";
        
        try {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(chatId);
            sendMessage.setText(message);
            execute(sendMessage);
            return true;
        } catch (TelegramApiException e) {
            logger.error("Failed to send OTP via Telegram: {}", e.getMessage(), e);
            return false;
        }
    }
    
    public boolean isUserRegisteredWithBot(String telegramUsername) {
        return userChatIds.containsKey(telegramUsername);
    }
    
    private void sendTextMessage(long chatId, String text) {
        try {
            SendMessage message = new SendMessage();
            message.setChatId(chatId);
            message.setText(text);
            execute(message);
        } catch (TelegramApiException e) {
            logger.error("Failed to send message: {}", e.getMessage(), e);
        }
    }
    
    // Create or update Telegram OTP
    public VerificationOtp createTelegramOtp(String email, String telegramUsername) {
        Optional<VerificationOtp> existingOtp = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.TELEGRAM);
        
        VerificationOtp otpEntity;
        if (existingOtp.isPresent()) {
            otpEntity = existingOtp.get();
        } else {
            otpEntity = new VerificationOtp();
            otpEntity.setEmail(email);
            otpEntity.setVerificationType(VerificationOtp.VerificationType.TELEGRAM);
        }
        
        // Store telegram username
        otpEntity.setTelegramUsername(telegramUsername);
        otpEntity.setOtp(otpService.generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);
        
        return verificationOtpRepository.save(otpEntity);
    }
    
    public VerificationOtp createTelegramOnlyOtp(String telegramUsername) {
        Optional<VerificationOtp> existingOtp = verificationOtpRepository.findByTelegramUsernameAndVerificationType(
                telegramUsername, VerificationOtp.VerificationType.TELEGRAM);
        
        VerificationOtp otpEntity;
        if (existingOtp.isPresent()) {
            otpEntity = existingOtp.get();
        } else {
            otpEntity = new VerificationOtp();
            otpEntity.setTelegramUsername(telegramUsername);
            otpEntity.setVerificationType(VerificationOtp.VerificationType.TELEGRAM);
        }
        
        otpEntity.setOtp(otpService.generateOtp());
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);
        
        return verificationOtpRepository.save(otpEntity);
    }
    
    public boolean verifyTelegramOtp(String email, String otp) {
        logger.info("Attempting to verify Telegram OTP for: {}", email);
        
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.TELEGRAM);
        
        if (otpEntityOpt.isEmpty()) {
            logger.error("No OTP record found for email: {}", email);
            return false;
        }
        
        VerificationOtp otpEntity = otpEntityOpt.get();
        
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
        logger.info("Telegram verification successful for: {}", email);
        return true;
    }
    
    public boolean verifyTelegramOnlyOtp(String telegramUsername, String otp) {
        logger.info("Attempting to verify Telegram-only OTP for: {}", telegramUsername);
        
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByTelegramUsernameAndVerificationType(
                telegramUsername, VerificationOtp.VerificationType.TELEGRAM);
        
        if (otpEntityOpt.isEmpty()) {
            logger.error("No OTP record found for Telegram username: {}", telegramUsername);
            return false;
        }
        
        VerificationOtp otpEntity = otpEntityOpt.get();
        
        if (otpEntity.isExpired()) {
            logger.error("OTP is expired for Telegram username: {}", telegramUsername);
            return false;
        }
        
        if (!otpEntity.getOtp().equals(otp)) {
            logger.error("OTP mismatch for Telegram username: {}. Expected: {}, Received: {}", 
                    telegramUsername, otpEntity.getOtp(), otp);
            return false;
        }
        
        otpEntity.setVerified(true);
        verificationOtpRepository.save(otpEntity);
        logger.info("Telegram verification successful for: {}", telegramUsername);
        return true;
    }
    
    // For login authentication
    public boolean sendLoginOtp(String telegramUsername, String otp) {
        // Get chat ID for the telegram username
        Long chatId = userChatIds.get(telegramUsername);
        if (chatId == null) {
            logger.error("No chat ID found for Telegram username: {}", telegramUsername);
            return false;
        }
        
        // Create a verification OTP entity with the provided OTP
        VerificationOtp otpEntity = new VerificationOtp();
        otpEntity.setTelegramUsername(telegramUsername);
        otpEntity.setVerificationType(VerificationOtp.VerificationType.TELEGRAM_LOGIN);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpEntity.setVerified(false);
        verificationOtpRepository.save(otpEntity);
        
        String message = "Your Bitby login OTP is: " + otp + 
                "\nThis OTP will expire in 5 minutes.";
        
        try {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(chatId);
            sendMessage.setText(message);
            execute(sendMessage);
            return true;
        } catch (TelegramApiException e) {
            logger.error("Failed to send login OTP via Telegram: {}", e.getMessage(), e);
            return false;
        }
    }
    
    public String getTelegramUsername(String email) {
        Optional<VerificationOtp> otpEntityOpt = verificationOtpRepository.findByEmailAndVerificationType(
                email, VerificationOtp.VerificationType.TELEGRAM);
        
        if (otpEntityOpt.isPresent() && otpEntityOpt.get().isVerified()) {
            return otpEntityOpt.get().getTelegramUsername();
        }
        
        return null;
    }
}
