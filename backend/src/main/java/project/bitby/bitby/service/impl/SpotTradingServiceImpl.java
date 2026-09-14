package project.bitby.bitby.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.bitby.bitby.dto.SpotOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.dto.TradeResponse;
import project.bitby.bitby.models.*;
import project.bitby.bitby.repository.*;
import project.bitby.bitby.service.SpotTradingService;
import project.bitby.bitby.service.TradingPairService;
import project.bitby.bitby.service.MarketDataService;
import project.bitby.bitby.service.OrderBookService;
import project.bitby.bitby.service.WebSocketService;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpotTradingServiceImpl implements SpotTradingService {

    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final OrderBookEntryRepository orderBookEntryRepository;
    private final UserRepository userRepository;
    private final TradingPairService tradingPairService;
    private final MarketDataService marketDataService;
    private final OrderBookService orderBookService;
    private final WebSocketService webSocketService;

    @Override
    @Transactional
    public SpotOrderResponse placeOrder(SpotOrderRequest request, String userId) {
        log.info("Placing order for user {}: {}", userId, request);
        
        // Validate request
        validateOrderRequest(request);
        
        // Lock the account for the rest of this transaction. Affordability is
        // decided by reading open orders, and without the lock two requests
        // from one account both read the state before either writes.
        User user = userRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + request.getSymbol()));
        
        // Validate balances
        validateUserBalance(user, request, tradingPair);
        
        // Create order
        Order order = createOrder(request, user, tradingPair);
        
        // Try to match order immediately
        tryMatchOrder(order, tradingPair);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Update order book
        orderBookService.updateOrderBookOnOrderPlaced(savedOrder);
        
        // Broadcast order update via WebSocket
        webSocketService.broadcastSpotOrderUpdate(userId, convertToSpotOrderResponse(savedOrder));
        
        log.info("Order placed successfully: {}", savedOrder.getId());
        
        return convertToSpotOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public SpotOrderResponse cancelOrder(Long orderId, String userId) {
        log.info("Cancelling order {} for user {}", orderId, userId);
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (order.getStatus() != Order.OrderStatus.PENDING && 
            order.getStatus() != Order.OrderStatus.PARTIAL_FILLED) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }
        
        // Refund remaining balance
        refundUserBalance(user, order);
        
        // Update order status
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        
        Order savedOrder = orderRepository.save(order);
        
        // Update order book
        orderBookService.updateOrderBookOnOrderCancelled(savedOrder);
        
        // Broadcast order update via WebSocket
        webSocketService.broadcastSpotOrderUpdate(userId, convertToSpotOrderResponse(savedOrder));
        
        log.info("Order cancelled successfully: {}", orderId);
        
        return convertToSpotOrderResponse(savedOrder);
    }

    @Override
    public List<SpotOrderResponse> getUserOrders(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SpotOrderResponse getOrderById(Long orderId, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        return convertToSpotOrderResponse(order);
    }

    @Override
    public OrderBookResponse getOrderBook(String symbol, int depth) {
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + symbol));
        
        return orderBookService.getOrderBook(tradingPair, depth);
    }

    @Override
    public List<TradeResponse> getUserTrades(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return tradeRepository.findByMakerUserOrTakerUserOrderByExecutedAtDesc(user, user)
                .stream()
                .map(this::convertToTradeResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TradeResponse> getRecentTrades(String symbol, int limit) {
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + symbol));
        
        return tradeRepository.findRecentTradesByTradingPairLimit(tradingPair, limit)
                .stream()
                .map(this::convertToTradeResponse)
                .collect(Collectors.toList());
    }

    // Private helper methods

    private void validateOrderRequest(SpotOrderRequest request) {
        if (request.getSymbol() == null || request.getSymbol().trim().isEmpty()) {
            throw new RuntimeException("Symbol is required");
        }
        
        if (request.getSide() == null || (!request.getSide().equals("BUY") && !request.getSide().equals("SELL"))) {
            throw new RuntimeException("Side must be BUY or SELL");
        }
        
        if (request.getOrderType() == null) {
            throw new RuntimeException("Order type is required");
        }
        
        if (request.getQuantity() == null || request.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        // Validate price for limit orders
        if (request.getOrderType().equals("LIMIT") || request.getOrderType().equals("STOP_LIMIT")) {
            if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Price is required for limit orders");
            }
        }
        
        // Validate stop price for stop orders
        if (request.getOrderType().equals("STOP_LIMIT") || request.getOrderType().equals("STOP_MARKET")) {
            if (request.getStopPrice() == null || request.getStopPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Stop price is required for stop orders");
            }
        }
    }

    /**
     * Weighs the order against what is still free, not the raw balance.
     *
     * Placing an order did not reserve anything, and this check only compared
     * against the total balance, so the same funds backed every open order: an
     * account holding 0.249 BTC could rest five sell orders of 0.2 BTC each.
     * Before trades settled that was harmless; once they settle it oversells
     * and drives the balance negative.
     */
    private void validateUserBalance(User user, SpotOrderRequest request, TradingPair tradingPair) {
        if (request.getSide().equals("BUY")) {
            // For buy orders, check quote asset balance (e.g., USDT)
            BigDecimal requiredAmount = request.getQuantity();
            if (request.getOrderType().equals("LIMIT") && request.getPrice() != null) {
                requiredAmount = request.getQuantity().multiply(request.getPrice());
            } else {
                // For market orders, we'll need to estimate the cost
                // For now, we'll use a simple validation
                requiredAmount = request.getQuantity().multiply(new BigDecimal("100000")); // High estimate
            }
            
            BigDecimal userBalance = getUserQuoteAssetBalance(user, tradingPair.getQuoteAsset());
            BigDecimal committed = orderRepository.sumCommittedQuoteAsset(user, tradingPair.getQuoteAsset());
            BigDecimal available = userBalance.subtract(committed != null ? committed : BigDecimal.ZERO);
            if (available.compareTo(requiredAmount) < 0) {
                throw new RuntimeException(String.format(
                        "Insufficient %s balance: %s available (%s of %s committed to open orders), %s required",
                        tradingPair.getQuoteAsset(), available.toPlainString(),
                        committed, userBalance.toPlainString(), requiredAmount.toPlainString()));
            }
        } else {
            // For sell orders, check base asset balance (e.g., BTC)
            BigDecimal userBalance = getUserBaseAssetBalance(user, tradingPair.getBaseAsset());
            BigDecimal committed = orderRepository.sumCommittedBaseAsset(user, tradingPair.getBaseAsset());
            BigDecimal available = userBalance.subtract(committed != null ? committed : BigDecimal.ZERO);
            if (available.compareTo(request.getQuantity()) < 0) {
                throw new RuntimeException(String.format(
                        "Insufficient %s balance: %s available (%s of %s committed to open orders), %s required",
                        tradingPair.getBaseAsset(), available.toPlainString(),
                        committed, userBalance.toPlainString(), request.getQuantity().toPlainString()));
            }
        }
    }

    private Order createOrder(SpotOrderRequest request, User user, TradingPair tradingPair) {
        Order order = new Order();
        order.setUser(user);
        order.setTradingPair(tradingPair);
        order.setOrderType(Order.OrderType.valueOf(request.getOrderType()));
        order.setSide(Order.OrderSide.valueOf(request.getSide()));
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        order.setStopPrice(request.getStopPrice());
        order.setRemainingQuantity(request.getQuantity());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        return order;
    }

    private void tryMatchOrder(Order order, TradingPair tradingPair) {
        if (order.getOrderType() == Order.OrderType.MARKET) {
            // For market orders, try to match immediately
            matchMarketOrder(order, tradingPair);
        } else if (order.getOrderType() == Order.OrderType.LIMIT) {
            // For limit orders, try to match if price is favorable
            matchLimitOrder(order, tradingPair);
        }
        // Stop orders will be handled by a separate scheduled task
    }

    private void matchMarketOrder(Order order, TradingPair tradingPair) {
        if (order.getSide() == Order.OrderSide.BUY) {
            // Match against sell orders
            List<Order> matchingOrders = orderRepository.findMatchingSellOrders(tradingPair,
                new BigDecimal("999999"), order.getUser()); // High price to match any sell order
            
            for (Order matchingOrder : matchingOrders) {
                if (order.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }
                
                executeTrade(order, matchingOrder, matchingOrder.getPrice());
            }
        } else {
            // Match against buy orders
            List<Order> matchingOrders = orderRepository.findMatchingBuyOrders(tradingPair,
                BigDecimal.ZERO, order.getUser()); // Low price to match any buy order
            
            for (Order matchingOrder : matchingOrders) {
                if (order.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }
                
                executeTrade(order, matchingOrder, matchingOrder.getPrice());
            }
        }
    }

    private void matchLimitOrder(Order order, TradingPair tradingPair) {
        if (order.getSide() == Order.OrderSide.BUY) {
            // Match against sell orders with price <= our limit
            List<Order> matchingOrders = orderRepository.findMatchingSellOrders(tradingPair, order.getPrice(), order.getUser());
            
            for (Order matchingOrder : matchingOrders) {
                if (order.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }
                
                executeTrade(order, matchingOrder, matchingOrder.getPrice());
            }
        } else {
            // Match against buy orders with price >= our limit
            List<Order> matchingOrders = orderRepository.findMatchingBuyOrders(tradingPair, order.getPrice(), order.getUser());
            
            for (Order matchingOrder : matchingOrders) {
                if (order.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }
                
                executeTrade(order, matchingOrder, matchingOrder.getPrice());
            }
        }
    }

    private void executeTrade(Order takerOrder, Order makerOrder, BigDecimal price) {
        BigDecimal tradeQuantity = takerOrder.getRemainingQuantity().min(makerOrder.getRemainingQuantity());
        
        // Calculate fees
        BigDecimal takerFee = calculateFee(tradeQuantity, price, takerOrder.getTradingPair().getTakerFee());
        BigDecimal makerFee = calculateFee(tradeQuantity, price, makerOrder.getTradingPair().getMakerFee());
        
        // Create trade record
        Trade trade = new Trade();
        trade.setTradingPair(takerOrder.getTradingPair());
        trade.setMakerOrder(makerOrder);
        trade.setTakerOrder(takerOrder);
        trade.setMakerUser(makerOrder.getUser());
        trade.setTakerUser(takerOrder.getUser());
        trade.setPrice(price);
        trade.setQuantity(tradeQuantity);
        trade.setMakerFee(makerFee);
        trade.setTakerFee(takerFee);
        trade.setTotalValue(tradeQuantity.multiply(price));
        trade.setExecutedAt(LocalDateTime.now());
        
        tradeRepository.save(trade);
        
        // Update orders
        updateOrderQuantities(takerOrder, makerOrder, tradeQuantity);
        
        // Update user balances
        updateUserBalances(takerOrder, makerOrder, tradeQuantity, price, takerFee, makerFee);
        
        // Update order book for both orders
        orderBookService.updateOrderBookOnOrderFilled(takerOrder);
        orderBookService.updateOrderBookOnOrderFilled(makerOrder);
        
        // Broadcast trade execution
        TradeResponse tradeResponse = convertToTradeResponse(trade);
        webSocketService.broadcastTradeExecution(trade.getTradingPair().getSymbol(), tradeResponse);
        webSocketService.broadcastUserTradeUpdate(takerOrder.getUser().getUserId(), tradeResponse);
        webSocketService.broadcastUserTradeUpdate(makerOrder.getUser().getUserId(), tradeResponse);
    }

    private void updateOrderQuantities(Order takerOrder, Order makerOrder, BigDecimal tradeQuantity) {
        // Update taker order
        takerOrder.setFilledQuantity(takerOrder.getFilledQuantity().add(tradeQuantity));
        takerOrder.setRemainingQuantity(takerOrder.getRemainingQuantity().subtract(tradeQuantity));
        takerOrder.setTotalFee(takerOrder.getTotalFee().add(calculateFee(tradeQuantity, takerOrder.getPrice() != null ? takerOrder.getPrice() : makerOrder.getPrice(), takerOrder.getTradingPair().getTakerFee())));
        
        if (takerOrder.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            takerOrder.setStatus(Order.OrderStatus.FILLED);
            takerOrder.setExecutedAt(LocalDateTime.now());
        } else {
            takerOrder.setStatus(Order.OrderStatus.PARTIAL_FILLED);
        }
        
        // Update maker order
        makerOrder.setFilledQuantity(makerOrder.getFilledQuantity().add(tradeQuantity));
        makerOrder.setRemainingQuantity(makerOrder.getRemainingQuantity().subtract(tradeQuantity));
        makerOrder.setTotalFee(makerOrder.getTotalFee().add(calculateFee(tradeQuantity, makerOrder.getPrice(), makerOrder.getTradingPair().getMakerFee())));
        
        if (makerOrder.getRemainingQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            makerOrder.setStatus(Order.OrderStatus.FILLED);
            makerOrder.setExecutedAt(LocalDateTime.now());
        } else {
            makerOrder.setStatus(Order.OrderStatus.PARTIAL_FILLED);
        }
        
        orderRepository.save(takerOrder);
        orderRepository.save(makerOrder);
    }

    /**
     * Settles a filled trade against both sides' balances.
     *
     * This method used to log the trade and return, leaving a TODO where the
     * settlement belonged. Orders were therefore marked FILLED and trades were
     * recorded while no balance moved: two accounts could trade back and forth
     * all day and end where they started.
     *
     * For a BASE/QUOTE pair, the buyer pays quantity x price of QUOTE and
     * receives QUANTITY of BASE; the seller does the reverse. calculateFee
     * returns a quote-denominated amount, so both fees are taken in QUOTE -
     * the buyer pays it on top, the seller has it withheld from the proceeds.
     */
    private void updateUserBalances(Order takerOrder, Order makerOrder, BigDecimal tradeQuantity,
                                   BigDecimal price, BigDecimal takerFee, BigDecimal makerFee) {
        TradingPair pair = takerOrder.getTradingPair();
        String baseAsset = pair.getBaseAsset();
        String quoteAsset = pair.getQuoteAsset();
        BigDecimal quoteValue = tradeQuantity.multiply(price);

        boolean takerIsBuyer = takerOrder.getSide() == Order.OrderSide.BUY;
        Order buyOrder = takerIsBuyer ? takerOrder : makerOrder;
        Order sellOrder = takerIsBuyer ? makerOrder : takerOrder;
        BigDecimal buyerFee = takerIsBuyer ? takerFee : makerFee;
        BigDecimal sellerFee = takerIsBuyer ? makerFee : takerFee;

        User buyer = buyOrder.getUser();
        User seller = sellOrder.getUser();

        if (!adjustBalance(buyer, quoteAsset, quoteValue.add(buyerFee).negate())
                || !adjustBalance(buyer, baseAsset, tradeQuantity)
                || !adjustBalance(seller, baseAsset, tradeQuantity.negate())
                || !adjustBalance(seller, quoteAsset, quoteValue.subtract(sellerFee))) {
            throw new IllegalStateException(
                    "Cannot settle trade on " + pair.getSymbol() + ": unsupported asset");
        }

        userRepository.save(buyer);
        userRepository.save(seller);

        log.info("Settled {} {} at {} ({} {} moved); buyer fee {}, seller fee {}",
                tradeQuantity, baseAsset, price, quoteValue, quoteAsset, buyerFee, sellerFee);
    }

    /**
     * Applies a signed delta to one asset. Returns false if the asset is
     * unsupported or the result would be negative - settlement should fail
     * loudly rather than leave an account owing the exchange.
     */
    private boolean adjustBalance(User user, String asset, BigDecimal delta) {
        BigDecimal current = user.getBalanceFor(asset);
        if (current == null) return false;
        BigDecimal updated = current.add(delta);
        if (updated.compareTo(BigDecimal.ZERO) < 0) {
            log.error("Refusing to settle: {} balance for user {} would fall to {}",
                    asset, user.getUserId(), updated.toPlainString());
            return false;
        }
        return user.setBalanceFor(asset, updated);
    }

    private BigDecimal calculateFee(BigDecimal quantity, BigDecimal price, BigDecimal feeRate) {
        return quantity.multiply(price).multiply(feeRate).setScale(8, RoundingMode.HALF_UP);
    }

    private void refundUserBalance(User user, Order order) {
        // TODO: Implement balance refund logic
        log.info("Refunding balance for cancelled order: {}", order.getId());
    }



    private BigDecimal getUserBaseAssetBalance(User user, String baseAsset) {
        BigDecimal balance = user.getBalanceFor(baseAsset);
        if (balance == null) {
            throw new RuntimeException("Unsupported base asset: " + baseAsset);
        }
        return balance;
    }

    private BigDecimal getUserQuoteAssetBalance(User user, String quoteAsset) {
        BigDecimal balance = user.getBalanceFor(quoteAsset);
        if (balance == null) {
            throw new RuntimeException("Unsupported quote asset: " + quoteAsset);
        }
        return balance;
    }

    private SpotOrderResponse convertToSpotOrderResponse(Order order) {
        return new SpotOrderResponse(
                order.getId(),
                order.getTradingPair().getSymbol(),
                order.getOrderType().toString(),
                order.getSide().toString(),
                order.getQuantity(),
                order.getPrice(),
                order.getStopPrice(),
                order.getFilledQuantity(),
                order.getRemainingQuantity(),
                order.getAveragePrice(),
                order.getStatus().toString(),
                order.getTotalFee(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getExecutedAt()
        );
    }

    private TradeResponse convertToTradeResponse(Trade trade) {
        return new TradeResponse(
                trade.getId(),
                trade.getTradingPair().getSymbol(),
                trade.getTakerOrder().getId(),
                trade.getPrice(),
                trade.getQuantity(),
                trade.getTotalValue(),
                trade.getTakerFee(),
                "BUY", // This should be determined based on the user's perspective
                trade.getExecutedAt()
        );
    }

    private OrderBookResponse.OrderBookLevel convertToOrderBookLevel(OrderBookEntry entry) {
        return new OrderBookResponse.OrderBookLevel(
                entry.getPrice(),
                entry.getTotalQuantity(),
                entry.getOrderCount()
        );
    }
} 