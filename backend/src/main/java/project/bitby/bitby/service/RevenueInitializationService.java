package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.bitby.bitby.config.FiatRates;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.service.MarketDataService;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RevenueInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MarketDataService marketDataService;

    // 20 billion USD starting revenue
    private static final BigDecimal STARTING_REVENUE_USD = new BigDecimal("20000000000.00");
    
    // Distribution percentages for different currencies
    private static final double USD_PERCENTAGE = 0.30; // 30% in USD
    private static final double GHS_PERCENTAGE = 0.20; // 20% in GHS
    private static final double BTC_PERCENTAGE = 0.15; // 15% in BTC
    private static final double ETH_PERCENTAGE = 0.15; // 15% in ETH
    private static final double USDT_PERCENTAGE = 0.10; // 10% in USDT
    private static final double BNB_PERCENTAGE = 0.10; // 10% in BNB

    // GHS to USD conversion rate
    // Was 0.0961, which is not the exact reciprocal of the 10.41 used elsewhere.
    private static final BigDecimal GHS_TO_USD_RATE = FiatRates.USD_PER_GHS;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting revenue initialization...");
        initializeApplicationRevenue();
        log.info("Revenue initialization completed.");
    }

    /**
     * Initialize the application with 20 billion USD starting revenue
     * distributed across all available currencies
     */
    @Transactional
    public void initializeApplicationRevenue() {
        try {
            // Create or update the system admin user with the starting revenue
            User systemUser = getOrCreateSystemUser();
            
            // Calculate distribution amounts
            BigDecimal usdAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(USD_PERCENTAGE));
            BigDecimal ghsAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(GHS_PERCENTAGE))
                    .divide(GHS_TO_USD_RATE, 2, BigDecimal.ROUND_HALF_UP);
            
            // Get current market prices for crypto distribution
            BigDecimal btcPrice = getCurrentCryptoPrice("BTC");
            BigDecimal ethPrice = getCurrentCryptoPrice("ETH");
            BigDecimal bnbPrice = getCurrentCryptoPrice("BNB");
            
            // Calculate crypto amounts based on USD value
            BigDecimal btcAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(BTC_PERCENTAGE))
                    .divide(btcPrice, 8, BigDecimal.ROUND_HALF_UP);
            BigDecimal ethAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(ETH_PERCENTAGE))
                    .divide(ethPrice, 8, BigDecimal.ROUND_HALF_UP);
            BigDecimal usdtAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(USDT_PERCENTAGE));
            BigDecimal bnbAmount = STARTING_REVENUE_USD.multiply(BigDecimal.valueOf(BNB_PERCENTAGE))
                    .divide(bnbPrice, 8, BigDecimal.ROUND_HALF_UP);

            // Set the balances
            systemUser.setUsdBalance(usdAmount.doubleValue());
            systemUser.setCediBalance(ghsAmount.doubleValue());
            systemUser.setBtcBalance(btcAmount.doubleValue());
            systemUser.setEthBalance(ethAmount.doubleValue());
            systemUser.setUsdtBalance(usdtAmount.doubleValue());
            systemUser.setBnbBalance(bnbAmount.doubleValue());

            // Save the updated user
            userRepository.save(systemUser);

            log.info("Application revenue initialized successfully:");
            log.info("USD Balance: ${}", usdAmount);
            log.info("GHS Balance: ₵{}", ghsAmount);
            log.info("BTC Balance: {} BTC", btcAmount);
            log.info("ETH Balance: {} ETH", ethAmount);
            log.info("USDT Balance: {} USDT", usdtAmount);
            log.info("BNB Balance: {} BNB", bnbAmount);
            log.info("Total Value: ${}", STARTING_REVENUE_USD);

        } catch (Exception e) {
            log.error("Error initializing application revenue: {}", e.getMessage(), e);
        }
    }

    /**
     * Get or create the system admin user
     */
    private User getOrCreateSystemUser() {
        Optional<User> existingUser = userRepository.findByUsername("system_admin");
        
        if (existingUser.isPresent()) {
            log.info("System admin user found, updating balances...");
            return existingUser.get();
        }

        log.info("Creating new system admin user...");
        User systemUser = new User();
        systemUser.setUsername("system_admin");
        systemUser.setUserId("system_admin_001");
        systemUser.setEmail("admin@bitby.com");
        systemUser.setPassword("$2a$10$dummy.password.hash.for.system.user");
        systemUser.setCreatedAt(java.time.LocalDateTime.now());
        
        return userRepository.save(systemUser);
    }

    /**
     * Get current price for a cryptocurrency
     */
    private BigDecimal getCurrentCryptoPrice(String symbol) {
        try {
            var marketData = marketDataService.getMarketDataBySymbol(symbol);
            if (marketData.isPresent() && marketData.get().getCurrentPrice() != null) {
                return marketData.get().getCurrentPrice();
            }
        } catch (Exception e) {
            log.warn("Could not fetch current price for {}, using default", symbol);
        }

        // Default prices if market data is not available
        switch (symbol) {
            case "BTC":
                return new BigDecimal("45000.00");
            case "ETH":
                return new BigDecimal("3000.00");
            case "BNB":
                return new BigDecimal("300.00");
            default:
                return BigDecimal.ONE;
        }
    }

    /**
     * Get the current system revenue in USD
     */
    public BigDecimal getCurrentSystemRevenue() {
        try {
            Optional<User> systemUser = userRepository.findByUsername("system_admin");
            if (systemUser.isPresent()) {
                User user = systemUser.get();
                
                BigDecimal totalRevenue = BigDecimal.ZERO;
                
                // Add USD balance
                if (user.getUsdBalance() != null) {
                    totalRevenue = totalRevenue.add(BigDecimal.valueOf(user.getUsdBalance()));
                }
                
                // Add GHS balance converted to USD
                if (user.getCediBalance() != null) {
                    BigDecimal ghsInUsd = BigDecimal.valueOf(user.getCediBalance()).multiply(GHS_TO_USD_RATE);
                    totalRevenue = totalRevenue.add(ghsInUsd);
                }
                
                // Add crypto balances converted to USD
                if (user.getBtcBalance() != null) {
                    BigDecimal btcPrice = getCurrentCryptoPrice("BTC");
                    BigDecimal btcInUsd = BigDecimal.valueOf(user.getBtcBalance()).multiply(btcPrice);
                    totalRevenue = totalRevenue.add(btcInUsd);
                }
                
                if (user.getEthBalance() != null) {
                    BigDecimal ethPrice = getCurrentCryptoPrice("ETH");
                    BigDecimal ethInUsd = BigDecimal.valueOf(user.getEthBalance()).multiply(ethPrice);
                    totalRevenue = totalRevenue.add(ethInUsd);
                }
                
                if (user.getUsdtBalance() != null) {
                    totalRevenue = totalRevenue.add(BigDecimal.valueOf(user.getUsdtBalance()));
                }
                
                if (user.getBnbBalance() != null) {
                    BigDecimal bnbPrice = getCurrentCryptoPrice("BNB");
                    BigDecimal bnbInUsd = BigDecimal.valueOf(user.getBnbBalance()).multiply(bnbPrice);
                    totalRevenue = totalRevenue.add(bnbInUsd);
                }
                
                return totalRevenue;
            }
        } catch (Exception e) {
            log.error("Error calculating current system revenue: {}", e.getMessage(), e);
        }
        
        return BigDecimal.ZERO;
    }

    /**
     * Check if the system has sufficient balance for a purchase
     */
    public boolean hasSufficientBalance(String currency, BigDecimal amount) {
        try {
            Optional<User> systemUser = userRepository.findByUsername("system_admin");
            if (systemUser.isPresent()) {
                User user = systemUser.get();
                
                switch (currency.toUpperCase()) {
                    case "USD":
                        return user.getUsdBalance() != null && 
                               BigDecimal.valueOf(user.getUsdBalance()).compareTo(amount) >= 0;
                    case "GHS":
                        return user.getCediBalance() != null && 
                               BigDecimal.valueOf(user.getCediBalance()).compareTo(amount) >= 0;
                    case "BTC":
                        return user.getBtcBalance() != null && 
                               BigDecimal.valueOf(user.getBtcBalance()).compareTo(amount) >= 0;
                    case "ETH":
                        return user.getEthBalance() != null && 
                               BigDecimal.valueOf(user.getEthBalance()).compareTo(amount) >= 0;
                    case "USDT":
                        return user.getUsdtBalance() != null && 
                               BigDecimal.valueOf(user.getUsdtBalance()).compareTo(amount) >= 0;
                    case "BNB":
                        return user.getBnbBalance() != null && 
                               BigDecimal.valueOf(user.getBnbBalance()).compareTo(amount) >= 0;
                    default:
                        return false;
                }
            }
        } catch (Exception e) {
            log.error("Error checking sufficient balance: {}", e.getMessage(), e);
        }
        
        return false;
    }
} 