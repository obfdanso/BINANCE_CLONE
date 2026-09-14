package project.bitby.bitby.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void updateVerificationOtpConstraint() {
        try {
            logger.info("Updating verification_otps constraint to include PASSWORD_RESET...");
            
            // Drop the existing constraint if it exists
            jdbcTemplate.execute("ALTER TABLE verification_otps DROP CONSTRAINT IF EXISTS verification_otps_verification_type_check");
            
            // Add the new constraint with PASSWORD_RESET included
            jdbcTemplate.execute(
                "ALTER TABLE verification_otps ADD CONSTRAINT verification_otps_verification_type_check " +
                "CHECK (verification_type::text = ANY (ARRAY['EMAIL'::character varying, 'MOBILE'::character varying, 'TELEGRAM'::character varying, 'TELEGRAM_LOGIN'::character varying, 'PASSWORD_RESET'::character varying]))"
            );
            
            logger.info("Successfully updated verification_otps constraint to include PASSWORD_RESET");
        } catch (Exception e) {
            logger.error("Failed to update verification_otps constraint: {}", e.getMessage(), e);
            // Don't throw the exception to allow the application to start
        }
    }
} 