package project.bitby.bitby.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import project.bitby.bitby.security.TokenBlacklist;

@Configuration
@EnableScheduling
public class SchedulingConfig {

    @Autowired
    private TokenBlacklist tokenBlacklist;
    
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupBlacklist() {
        tokenBlacklist.cleanupExpiredTokens();
    }
}
