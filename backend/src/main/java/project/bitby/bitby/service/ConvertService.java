package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.bitby.bitby.dto.ConvertQuoteRequest;
import project.bitby.bitby.dto.ConvertQuoteResponse;
import project.bitby.bitby.dto.ConvertRequest;
import project.bitby.bitby.dto.ConvertResponse;
import project.bitby.bitby.models.ConvertOrder;
import project.bitby.bitby.models.Cryptocurrency;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.ConvertOrderRepository;
import project.bitby.bitby.repository.CryptocurrencyRepository;
import project.bitby.bitby.repository.UserRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import project.bitby.bitby.dto.MarketDataResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConvertService {

    private final ConvertOrderRepository convertOrderRepository;
    private final CryptocurrencyRepository cryptocurrencyRepository;
    private final UserRepository userRepository;
    private final MarketDataService marketDataService;
    private final WebSocketService webSocketService;

    // Conversion fee percentage (0.1% = 0.001)
    private static final BigDecimal CONVERSION_FEE_PERCENTAGE = new BigDecimal("0.001");
    
    // Quote expiration time in minutes
    private static final int QUOTE_EXPIRATION_MINUTES = 1;

    /**
     * Get a quote for conversion
     */
    public ConvertQuoteResponse getQuote(ConvertQuoteRequest request) {
        try {
            log.info("Getting quote for conversion: {} {} to {}", 
                    request.getAmount(), request.getFromSymbol(), request.getToSymbol());

            // Use MarketDataService for real-time prices
            Optional<MarketDataResponse> fromMarket = marketDataService.getMarketDataBySymbol(request.getFromSymbol());
            Optional<MarketDataResponse> toMarket = marketDataService.getMarketDataBySymbol(request.getToSymbol());

            if (fromMarket.isEmpty() || toMarket.isEmpty()) {
                return createErrorQuoteResponse("One or both cryptocurrencies not found in market data");
            }

            MarketDataResponse from = fromMarket.get();
            MarketDataResponse to = toMarket.get();

            if (from.getCurrentPrice() == null || to.getCurrentPrice() == null ||
                from.getCurrentPrice().compareTo(BigDecimal.ZERO) <= 0 ||
                to.getCurrentPrice().compareTo(BigDecimal.ZERO) <= 0) {
                return createErrorQuoteResponse("One or both cryptocurrencies have invalid price data");
            }

            // Calculate exchange rate (from crypto price / to crypto price)
            BigDecimal exchangeRate = from.getCurrentPrice().divide(to.getCurrentPrice(), 8, RoundingMode.HALF_UP);
            // Calculate conversion amount
            BigDecimal toAmount = request.getAmount().multiply(exchangeRate);
            // Calculate fee
            BigDecimal fee = toAmount.multiply(CONVERSION_FEE_PERCENTAGE);
            BigDecimal finalAmount = toAmount.subtract(fee);

            ConvertQuoteResponse response = new ConvertQuoteResponse();
            response.setFromSymbol(request.getFromSymbol().toUpperCase());
            response.setToSymbol(request.getToSymbol().toUpperCase());
            response.setFromAmount(request.getAmount());
            response.setToAmount(finalAmount);
            response.setExchangeRate(exchangeRate);
            response.setFee(fee);
            response.setFeePercentage(CONVERSION_FEE_PERCENTAGE);
            response.setQuoteTime(LocalDateTime.now());
            response.setExpiresAt(LocalDateTime.now().plusMinutes(QUOTE_EXPIRATION_MINUTES));
            response.setSuccess(true);
            response.setMessage("Quote generated successfully");

            log.info("Quote generated: {} {} = {} {} (Rate: {}, Fee: {})", 
                    request.getAmount(), request.getFromSymbol(), 
                    finalAmount, request.getToSymbol(), exchangeRate, fee);

            return response;

        } catch (Exception e) {
            log.error("Error generating quote: {}", e.getMessage(), e);
            return createErrorQuoteResponse("Error generating quote: " + e.getMessage());
        }
    }

    /**
     * Create instant conversion order
     */
    @Transactional
    public ConvertResponse createInstantConvert(ConvertRequest request, String userId) {
        try {
            log.info("Creating instant convert order for user {}: {} {} to {}", 
                    userId, request.getAmount(), request.getFromSymbol(), request.getToSymbol());

            // Validate request
            if (!request.isValid()) {
                return createErrorResponse("Invalid request parameters");
            }

            // Get user by userId
            Optional<User> userOpt = userRepository.findByUserId(userId);
            if (userOpt.isEmpty()) {
                return createErrorResponse("User not found");
            }

            // Use MarketDataService for real-time prices
            Optional<MarketDataResponse> fromMarket = marketDataService.getMarketDataBySymbol(request.getFromSymbol());
            Optional<MarketDataResponse> toMarket = marketDataService.getMarketDataBySymbol(request.getToSymbol());
            if (fromMarket.isEmpty() || toMarket.isEmpty()) {
                return createErrorResponse("One or both cryptocurrencies not found in market data");
            }

            // Get cryptocurrencies for foreign key (entity) references
            Optional<Cryptocurrency> fromCrypto = cryptocurrencyRepository.findBySymbol(request.getFromSymbol().toUpperCase());
            Optional<Cryptocurrency> toCrypto = cryptocurrencyRepository.findBySymbol(request.getToSymbol().toUpperCase());
            if (fromCrypto.isEmpty()) {
                log.error("fromCrypto not found in DB for symbol: {}", request.getFromSymbol());
                return createErrorResponse("From cryptocurrency not found in database: " + request.getFromSymbol());
            }
            if (toCrypto.isEmpty()) {
                log.error("toCrypto not found in DB for symbol: {}", request.getToSymbol());
                return createErrorResponse("To cryptocurrency not found in database: " + request.getToSymbol());
            }
            log.info("fromCrypto: {} (ID: {}), toCrypto: {} (ID: {})", fromCrypto.get().getSymbol(), fromCrypto.get().getId(), toCrypto.get().getSymbol(), toCrypto.get().getId());

            // Get current quote (uses real-time prices now)
            ConvertQuoteRequest quoteRequest = new ConvertQuoteRequest();
            quoteRequest.setFromSymbol(request.getFromSymbol());
            quoteRequest.setToSymbol(request.getToSymbol());
            quoteRequest.setAmount(request.getAmount());
            ConvertQuoteResponse quote = getQuote(quoteRequest);
            if (!quote.isSuccess()) {
                return createErrorResponse(quote.getMessage());
            }

            /*
             * Move the funds.
             *
             * This step did not exist: the order was written with status
             * EXECUTED and returned as a success while no balance changed, and
             * with nothing checking the balance first a request to convert far
             * more than the account held was reported as executed too.
             */
            User user = userOpt.get();
            String fromAsset = request.getFromSymbol().toUpperCase();
            String toAsset = request.getToSymbol().toUpperCase();

            Double fromBalance = user.getBalanceFor(fromAsset);
            Double toBalance = user.getBalanceFor(toAsset);
            if (fromBalance == null) {
                return createErrorResponse("Unsupported asset: " + fromAsset);
            }
            if (toBalance == null) {
                return createErrorResponse("Unsupported asset: " + toAsset);
            }

            BigDecimal requested = request.getAmount();
            if (BigDecimal.valueOf(fromBalance).compareTo(requested) < 0) {
                return createErrorResponse(String.format(
                        "Insufficient %s balance: have %s, need %s",
                        fromAsset, fromBalance, requested.toPlainString()));
            }

            BigDecimal credited = quote.getToAmount();
            user.setBalanceFor(fromAsset, BigDecimal.valueOf(fromBalance).subtract(requested).doubleValue());
            user.setBalanceFor(toAsset, BigDecimal.valueOf(toBalance).add(credited).doubleValue());
            userRepository.save(user);

            // Create convert order
            ConvertOrder order = new ConvertOrder();
            order.setUser(user);
            order.setFromCrypto(fromCrypto.get());
            order.setToCrypto(toCrypto.get());
            order.setFromAmount(request.getAmount());
            order.setToAmount(quote.getToAmount());
            order.setExchangeRate(quote.getExchangeRate());
            order.setConvertType(ConvertOrder.ConvertType.INSTANT);
            order.setStatus(ConvertOrder.ConvertStatus.EXECUTED);
            order.setExecutedAt(LocalDateTime.now());

            ConvertOrder savedOrder = convertOrderRepository.save(order);

            // Broadcast conversion via WebSocket
            webSocketService.broadcastConvertOrder(savedOrder);

            log.info("Instant convert order executed successfully: Order ID {}", savedOrder.getId());

            return createSuccessResponse(savedOrder, "Instant conversion executed successfully");

        } catch (Exception e) {
            log.error("Error creating instant convert: {}", e.getMessage(), e);
            return createErrorResponse("Error creating instant convert: " + e.getMessage());
        }
    }

    /**
     * Create limit conversion order
     */
    @Transactional
    public ConvertResponse createLimitConvert(ConvertRequest request, String userId) {
        try {
            log.info("Creating limit convert order for user {}: {} {} to {} at price {}", 
                    userId, request.getAmount(), request.getFromSymbol(), 
                    request.getToSymbol(), request.getTargetPrice());

            // Validate request
            if (!request.isValid()) {
                return createErrorResponse("Invalid request parameters");
            }

            // Get user and cryptocurrencies
            Optional<User> userOpt = userRepository.findByUserId(userId);
            // Use MarketDataService for real-time prices
            Optional<MarketDataResponse> fromMarket = marketDataService.getMarketDataBySymbol(request.getFromSymbol());
            Optional<MarketDataResponse> toMarket = marketDataService.getMarketDataBySymbol(request.getToSymbol());
            if (fromMarket.isEmpty() || toMarket.isEmpty()) {
                return createErrorResponse("One or both cryptocurrencies not found in market data");
            }
            // Get cryptocurrencies for foreign key (entity) references
            Optional<Cryptocurrency> fromCrypto = cryptocurrencyRepository.findBySymbol(request.getFromSymbol().toUpperCase());
            Optional<Cryptocurrency> toCrypto = cryptocurrencyRepository.findBySymbol(request.getToSymbol().toUpperCase());
            if (userOpt.isEmpty() || fromCrypto.isEmpty() || toCrypto.isEmpty()) {
                return createErrorResponse("User or cryptocurrency not found in database");
            }

            // Create convert order
            ConvertOrder order = new ConvertOrder();
            order.setUser(userOpt.get());
            order.setFromCrypto(fromCrypto.get());
            order.setToCrypto(toCrypto.get());
            order.setFromAmount(request.getAmount());
            order.setConvertType(ConvertOrder.ConvertType.LIMIT);
            order.setStatus(ConvertOrder.ConvertStatus.PENDING);
            order.setTargetPrice(request.getTargetPrice());
            order.setExpiresAt(request.getExpiresAt());

            ConvertOrder savedOrder = convertOrderRepository.save(order);

            log.info("Limit convert order created successfully: Order ID {}", savedOrder.getId());

            return createSuccessResponse(savedOrder, "Limit conversion order created successfully");

        } catch (Exception e) {
            log.error("Error creating limit convert: {}", e.getMessage(), e);
            return createErrorResponse("Error creating limit convert: " + e.getMessage());
        }
    }

    /**
     * Create recurring conversion order
     */
    @Transactional
    public ConvertResponse createRecurringConvert(ConvertRequest request, String userId) {
        try {
            log.info("Creating recurring convert order for user {}: {} {} to {} every {}", 
                    userId, request.getAmount(), request.getFromSymbol(), 
                    request.getToSymbol(), request.getRecurringInterval());

            // Validate request
            if (!request.isValid()) {
                return createErrorResponse("Invalid request parameters");
            }

            // Get user and cryptocurrencies
            Optional<User> userOpt = userRepository.findByUserId(userId);
            // Use MarketDataService for real-time prices
            Optional<MarketDataResponse> fromMarket = marketDataService.getMarketDataBySymbol(request.getFromSymbol());
            Optional<MarketDataResponse> toMarket = marketDataService.getMarketDataBySymbol(request.getToSymbol());
            if (fromMarket.isEmpty() || toMarket.isEmpty()) {
                return createErrorResponse("One or both cryptocurrencies not found in market data");
            }
            // Get cryptocurrencies for foreign key (entity) references
            Optional<Cryptocurrency> fromCrypto = cryptocurrencyRepository.findBySymbol(request.getFromSymbol().toUpperCase());
            Optional<Cryptocurrency> toCrypto = cryptocurrencyRepository.findBySymbol(request.getToSymbol().toUpperCase());
            if (userOpt.isEmpty() || fromCrypto.isEmpty() || toCrypto.isEmpty()) {
                return createErrorResponse("User or cryptocurrency not found in database");
            }

            // Calculate next execution time
            LocalDateTime nextExecutionTime = calculateNextExecutionTime(request.getStartTime(), request.getRecurringInterval());

            // Create convert order
            ConvertOrder order = new ConvertOrder();
            order.setUser(userOpt.get());
            order.setFromCrypto(fromCrypto.get());
            order.setToCrypto(toCrypto.get());
            order.setFromAmount(request.getAmount());
            order.setConvertType(ConvertOrder.ConvertType.RECURRING);
            order.setStatus(ConvertOrder.ConvertStatus.PENDING);
            order.setRecurringInterval(request.getRecurringInterval());
            order.setNextExecutionTime(nextExecutionTime);
            order.setMaxExecutions(request.getMaxExecutions());
            order.setExpiresAt(request.getExpiresAt());

            ConvertOrder savedOrder = convertOrderRepository.save(order);

            log.info("Recurring convert order created successfully: Order ID {}", savedOrder.getId());

            return createSuccessResponse(savedOrder, "Recurring conversion order created successfully");

        } catch (Exception e) {
            log.error("Error creating recurring convert: {}", e.getMessage(), e);
            return createErrorResponse("Error creating recurring convert: " + e.getMessage());
        }
    }

    /**
     * Execute pending limit orders when market conditions are met
     */
    @Scheduled(fixedRate = 60000) // Check every minute
    @Transactional
    public void executeLimitOrders() {
        try {
            log.debug("Checking for executable limit orders...");

            // Get all cryptocurrency pairs (symbols)
            List<Cryptocurrency> allCryptos = cryptocurrencyRepository.findAll();

            for (Cryptocurrency fromCrypto : allCryptos) {
                for (Cryptocurrency toCrypto : allCryptos) {
                    if (!fromCrypto.getSymbol().equals(toCrypto.getSymbol())) {
                        // Use MarketDataService for real-time prices
                        Optional<MarketDataResponse> fromMarket = marketDataService.getMarketDataBySymbol(fromCrypto.getSymbol());
                        Optional<MarketDataResponse> toMarket = marketDataService.getMarketDataBySymbol(toCrypto.getSymbol());
                        if (fromMarket.isEmpty() || toMarket.isEmpty() ||
                            fromMarket.get().getCurrentPrice() == null || toMarket.get().getCurrentPrice() == null ||
                            fromMarket.get().getCurrentPrice().compareTo(BigDecimal.ZERO) <= 0 ||
                            toMarket.get().getCurrentPrice().compareTo(BigDecimal.ZERO) <= 0) {
                            continue; // skip if no valid price
                        }
                        // Calculate current exchange rate
                        BigDecimal currentRate = fromMarket.get().getCurrentPrice().divide(toMarket.get().getCurrentPrice(), 8, RoundingMode.HALF_UP);

                        // Find executable limit orders
                        List<ConvertOrder> executableOrders = convertOrderRepository.findExecutableLimitOrders(
                                fromCrypto.getSymbol(), toCrypto.getSymbol(), currentRate);

                        for (ConvertOrder order : executableOrders) {
                            executeLimitOrder(order, currentRate);
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error executing limit orders: {}", e.getMessage(), e);
        }
    }

    /**
     * Execute pending recurring orders
     */
    @Scheduled(fixedRate = 60000) // Check every minute
    @Transactional
    public void executeRecurringOrders() {
        try {
            log.debug("Checking for executable recurring orders...");

            List<ConvertOrder> executableOrders = convertOrderRepository.findExecutableRecurringOrders(LocalDateTime.now());

            for (ConvertOrder order : executableOrders) {
                // Use MarketDataService for real-time prices in quote
                ConvertQuoteRequest quoteRequest = new ConvertQuoteRequest();
                quoteRequest.setFromSymbol(order.getFromCrypto().getSymbol());
                quoteRequest.setToSymbol(order.getToCrypto().getSymbol());
                quoteRequest.setAmount(order.getFromAmount());
                ConvertQuoteResponse quote = getQuote(quoteRequest);
                if (quote.isSuccess()) {
                    order.setToAmount(quote.getToAmount());
                    order.setExchangeRate(quote.getExchangeRate());
                    order.setLastExecutionTime(LocalDateTime.now());
                    order.setTotalExecutions(order.getTotalExecutions() + 1);

                    // Calculate next execution time
                    order.setNextExecutionTime(calculateNextExecutionTime(
                            order.getLastExecutionTime(), order.getRecurringInterval()));

                    // Check if max executions reached
                    if (order.getMaxExecutions() != null && 
                        order.getTotalExecutions() >= order.getMaxExecutions()) {
                        order.setStatus(ConvertOrder.ConvertStatus.EXECUTED);
                    }

                    ConvertOrder savedOrder = convertOrderRepository.save(order);
                    webSocketService.broadcastConvertOrder(savedOrder);

                    log.info("Recurring order {} executed ({} of {})", 
                            order.getId(), order.getTotalExecutions(), order.getMaxExecutions());
                }
            }

        } catch (Exception e) {
            log.error("Error executing recurring orders: {}", e.getMessage(), e);
        }
    }

    /**
     * Expire old orders
     */
    @Scheduled(fixedRate = 300000) // Check every 5 minutes
    @Transactional
    public void expireOrders() {
        try {
            log.debug("Checking for expired orders...");

            List<ConvertOrder> expiredOrders = convertOrderRepository.findExpiredOrders(LocalDateTime.now());

            for (ConvertOrder order : expiredOrders) {
                order.setStatus(ConvertOrder.ConvertStatus.EXPIRED);
                convertOrderRepository.save(order);
                log.info("Order {} expired", order.getId());
            }

        } catch (Exception e) {
            log.error("Error expiring orders: {}", e.getMessage(), e);
        }
    }

    /**
     * Get user's convert orders
     */
    public List<ConvertResponse> getUserOrders(String userId) {
        List<ConvertOrder> orders = convertOrderRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(order -> createSuccessResponse(order, null))
                .toList();
    }

    /**
     * Cancel a convert order
     */
    @Transactional
    public ConvertResponse cancelOrder(Long orderId, String userId) {
        try {
            Optional<ConvertOrder> orderOpt = convertOrderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return createErrorResponse("Order not found");
            }

            ConvertOrder order = orderOpt.get();
            if (!order.getUser().getUserId().equals(userId)) {
                return createErrorResponse("Unauthorized to cancel this order");
            }

            if (order.getStatus() != ConvertOrder.ConvertStatus.PENDING) {
                return createErrorResponse("Order cannot be cancelled");
            }

            order.setStatus(ConvertOrder.ConvertStatus.CANCELLED);
            ConvertOrder savedOrder = convertOrderRepository.save(order);

            log.info("Order {} cancelled by user {}", orderId, userId);

            return createSuccessResponse(savedOrder, "Order cancelled successfully");

        } catch (Exception e) {
            log.error("Error cancelling order: {}", e.getMessage(), e);
            return createErrorResponse("Error cancelling order: " + e.getMessage());
        }
    }

    // Helper methods

    private void executeLimitOrder(ConvertOrder order, BigDecimal currentRate) {
        try {
            // Get current quote
            ConvertQuoteRequest quoteRequest = new ConvertQuoteRequest();
            quoteRequest.setFromSymbol(order.getFromCrypto().getSymbol());
            quoteRequest.setToSymbol(order.getToCrypto().getSymbol());
            quoteRequest.setAmount(order.getFromAmount());

            ConvertQuoteResponse quote = getQuote(quoteRequest);
            if (quote.isSuccess()) {
                order.setToAmount(quote.getToAmount());
                order.setExchangeRate(quote.getExchangeRate());
                order.setStatus(ConvertOrder.ConvertStatus.EXECUTED);
                order.setExecutedAt(LocalDateTime.now());

                ConvertOrder savedOrder = convertOrderRepository.save(order);
                webSocketService.broadcastConvertOrder(savedOrder);

                log.info("Limit order {} executed at rate {}", order.getId(), currentRate);
            }
        } catch (Exception e) {
            log.error("Error executing limit order {}: {}", order.getId(), e.getMessage(), e);
            order.setStatus(ConvertOrder.ConvertStatus.FAILED);
            convertOrderRepository.save(order);
        }
    }

    private void executeRecurringOrder(ConvertOrder order) {
        try {
            // Get current quote
            ConvertQuoteRequest quoteRequest = new ConvertQuoteRequest();
            quoteRequest.setFromSymbol(order.getFromCrypto().getSymbol());
            quoteRequest.setToSymbol(order.getToCrypto().getSymbol());
            quoteRequest.setAmount(order.getFromAmount());

            ConvertQuoteResponse quote = getQuote(quoteRequest);
            if (quote.isSuccess()) {
                order.setToAmount(quote.getToAmount());
                order.setExchangeRate(quote.getExchangeRate());
                order.setLastExecutionTime(LocalDateTime.now());
                order.setTotalExecutions(order.getTotalExecutions() + 1);

                // Calculate next execution time
                order.setNextExecutionTime(calculateNextExecutionTime(
                        order.getLastExecutionTime(), order.getRecurringInterval()));

                // Check if max executions reached
                if (order.getMaxExecutions() != null && 
                    order.getTotalExecutions() >= order.getMaxExecutions()) {
                    order.setStatus(ConvertOrder.ConvertStatus.EXECUTED);
                }

                ConvertOrder savedOrder = convertOrderRepository.save(order);
                webSocketService.broadcastConvertOrder(savedOrder);

                log.info("Recurring order {} executed ({} of {})", 
                        order.getId(), order.getTotalExecutions(), order.getMaxExecutions());
            }
        } catch (Exception e) {
            log.error("Error executing recurring order {}: {}", order.getId(), e.getMessage(), e);
        }
    }

    private LocalDateTime calculateNextExecutionTime(LocalDateTime currentTime, ConvertOrder.RecurringInterval interval) {
        return switch (interval) {
            case DAILY -> currentTime.plusDays(1);
            case WEEKLY -> currentTime.plusWeeks(1);
            case MONTHLY -> currentTime.plusMonths(1);
        };
    }

    private ConvertQuoteResponse createErrorQuoteResponse(String message) {
        ConvertQuoteResponse response = new ConvertQuoteResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    private ConvertResponse createErrorResponse(String message) {
        ConvertResponse response = new ConvertResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    private ConvertResponse createSuccessResponse(ConvertOrder order, String message) {
        ConvertResponse response = new ConvertResponse();
        response.setOrderId(order.getId());
        response.setFromSymbol(order.getFromCrypto().getSymbol());
        response.setToSymbol(order.getToCrypto().getSymbol());
        response.setFromAmount(order.getFromAmount());
        response.setToAmount(order.getToAmount());
        response.setExchangeRate(order.getExchangeRate());
        response.setConvertType(order.getConvertType());
        response.setStatus(order.getStatus());
        response.setTargetPrice(order.getTargetPrice());
        response.setRecurringInterval(order.getRecurringInterval());
        response.setNextExecutionTime(order.getNextExecutionTime());
        response.setLastExecutionTime(order.getLastExecutionTime());
        response.setTotalExecutions(order.getTotalExecutions());
        response.setMaxExecutions(order.getMaxExecutions());
        response.setCreatedAt(order.getCreatedAt());
        response.setExecutedAt(order.getExecutedAt());
        response.setExpiresAt(order.getExpiresAt());
        response.setMessage(message);
        response.setSuccess(true);
        return response;
    }
} 