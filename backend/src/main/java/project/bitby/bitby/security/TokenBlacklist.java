package project.bitby.bitby.security;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.Map;

@Component
public class TokenBlacklist {
    private Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();
    
    // Add token to blacklist with expiry
    public void blacklistToken(String token, long expiryInMillis) {
        blacklistedTokens.put(token, Instant.now().plusMillis(expiryInMillis));
    }
    
    // Check if token is blacklisted
    public boolean isBlacklisted(String token) {
        if (!blacklistedTokens.containsKey(token)) {
            return false;
        }
        
        // Remove expired tokens when checking
        if (blacklistedTokens.get(token).isBefore(Instant.now())) {
            blacklistedTokens.remove(token);
            return false;
        }
        
        return true;
    }
    
    // Cleanup method to remove expired tokens (can be called by a scheduled task)
    public void cleanupExpiredTokens() {
        Instant now = Instant.now();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
