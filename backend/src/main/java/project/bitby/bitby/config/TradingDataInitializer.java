package project.bitby.bitby.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import project.bitby.bitby.service.TradingPairService;

@Component
@RequiredArgsConstructor
@Slf4j
public class TradingDataInitializer implements CommandLineRunner {

    private final TradingPairService tradingPairService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing trading data...");
        
        try {
            // Initialize default trading pairs
            tradingPairService.initializeDefaultTradingPairs();
            
            log.info("Trading data initialization completed successfully");
        } catch (Exception e) {
            log.error("Error initializing trading data: {}", e.getMessage(), e);
        }
    }
} 