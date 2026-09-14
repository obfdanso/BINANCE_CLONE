package project.bitby.bitby.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.bitby.bitby.dto.AdvancedOrderRequest;
import project.bitby.bitby.dto.OrderModificationRequest;
import project.bitby.bitby.dto.BulkOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderStatisticsResponse;
import project.bitby.bitby.models.Order;
import project.bitby.bitby.models.TradingPair;
import project.bitby.bitby.models.User;
import project.bitby.bitby.repository.OrderRepository;
import project.bitby.bitby.repository.UserRepository;
import project.bitby.bitby.service.AdvancedOrderService;
import project.bitby.bitby.service.OrderBookService;
import project.bitby.bitby.service.SpotTradingService;
import project.bitby.bitby.service.TradingPairService;
import project.bitby.bitby.service.WebSocketService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdvancedOrderServiceImpl implements AdvancedOrderService {

    private final SpotTradingService spotTradingService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TradingPairService tradingPairService;
    private final OrderBookService orderBookService;
    private final WebSocketService webSocketService;

    @Override
    @Transactional
    public SpotOrderResponse placeAdvancedOrder(AdvancedOrderRequest request, String userId) {
        log.info("Placing advanced order for user {}: {}", userId, request);
        
        // Validate request
        if (!request.isValid()) {
            throw new RuntimeException("Invalid advanced order request");
        }
        
        // Get user and trading pair
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + request.getSymbol()));
        
        // Create order based on type
        Order order = createAdvancedOrder(request, user, tradingPair);
        
        // Handle different order types
        switch (order.getOrderType()) {
            case STOP_LIMIT:
            case STOP_MARKET:
                // Store stop order for later processing
                order.setStatus(Order.OrderStatus.PENDING);
                break;
            case IOC:
                // Try to execute immediately, cancel remaining
                processIOCOrder(order, tradingPair);
                break;
            case FOK:
                // Try to execute completely, cancel if not possible
                processFOKOrder(order, tradingPair);
                break;
            case GTD:
                // Check expiration time
                if (order.getExpirationTime().isBefore(LocalDateTime.now())) {
                    order.setStatus(Order.OrderStatus.EXPIRED);
                } else {
                    order.setStatus(Order.OrderStatus.PENDING);
                }
                break;
            case TRAILING_STOP:
                // Store trailing stop order for later processing
                order.setStatus(Order.OrderStatus.PENDING);
                break;
            default:
                // Handle as regular order
                order.setStatus(Order.OrderStatus.PENDING);
                break;
        }
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Update order book if order is active
        if (savedOrder.getStatus() == Order.OrderStatus.PENDING || 
            savedOrder.getStatus() == Order.OrderStatus.PARTIAL_FILLED) {
            orderBookService.updateOrderBookOnOrderPlaced(savedOrder);
        }
        
        // Broadcast order update
        webSocketService.broadcastSpotOrderUpdate(userId, convertToSpotOrderResponse(savedOrder));
        
        log.info("Advanced order placed successfully: {}", savedOrder.getId());
        
        return convertToSpotOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public SpotOrderResponse modifyOrder(OrderModificationRequest request, String userId) {
        log.info("Modifying order {} for user {}", request.getOrderId(), userId);
        
        if (!request.isValid()) {
            throw new RuntimeException("Invalid order modification request");
        }
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = orderRepository.findByIdAndUser(request.getOrderId(), user)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if order can be modified
        if (order.getStatus() != Order.OrderStatus.PENDING && 
            order.getStatus() != Order.OrderStatus.PARTIAL_FILLED) {
            throw new RuntimeException("Cannot modify order with status: " + order.getStatus());
        }
        
        // Apply modifications
        boolean modified = false;
        
        if (request.isPriceModification()) {
            order.setPrice(request.getNewPrice());
            modified = true;
        }
        
        if (request.isQuantityModification()) {
            BigDecimal newRemaining = request.getNewQuantity().subtract(order.getFilledQuantity());
            if (newRemaining.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("New quantity cannot be less than filled quantity");
            }
            order.setQuantity(request.getNewQuantity());
            order.setRemainingQuantity(newRemaining);
            modified = true;
        }
        
        if (request.isStopPriceModification()) {
            order.setStopPrice(request.getNewStopPrice());
            modified = true;
        }
        
        if (request.isExpirationModification()) {
            order.setExpirationTime(request.getNewExpirationTime());
            modified = true;
        }
        
        if (!modified) {
            throw new RuntimeException("No valid modifications provided");
        }
        
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);
        
        // Update order book
        orderBookService.updateOrderBookOnOrderPlaced(savedOrder);
        
        // Broadcast order update
        webSocketService.broadcastSpotOrderUpdate(userId, convertToSpotOrderResponse(savedOrder));
        
        log.info("Order modified successfully: {}", savedOrder.getId());
        
        return convertToSpotOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public List<SpotOrderResponse> placeBulkOrders(BulkOrderRequest request, String userId) {
        log.info("Placing bulk orders for user {}: {} orders", userId, request.getOrderCount());
        
        if (!request.isValid()) {
            throw new RuntimeException("Invalid bulk order request");
        }
        
        return request.getOrders().stream()
                .map(orderRequest -> {
                    try {
                        return placeAdvancedOrder(orderRequest, userId);
                    } catch (Exception e) {
                        log.error("Error placing order in bulk: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SpotOrderResponse> cancelAllOrders(String userId) {
        log.info("Cancelling all orders for user {}", userId);
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Order> activeOrders = orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.PENDING || 
                                order.getStatus() == Order.OrderStatus.PARTIAL_FILLED)
                .collect(Collectors.toList());
        
        return activeOrders.stream()
                .map(order -> {
                    try {
                        return spotTradingService.cancelOrder(order.getId(), userId);
                    } catch (Exception e) {
                        log.error("Error cancelling order {}: {}", order.getId(), e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SpotOrderResponse> cancelOrdersBySymbol(String symbol, String userId) {
        log.info("Cancelling orders for symbol {} and user {}", symbol, userId);
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + symbol));
        
        List<Order> activeOrders = orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getTradingPair().equals(tradingPair) &&
                                (order.getStatus() == Order.OrderStatus.PENDING || 
                                 order.getStatus() == Order.OrderStatus.PARTIAL_FILLED))
                .collect(Collectors.toList());
        
        return activeOrders.stream()
                .map(order -> {
                    try {
                        return spotTradingService.cancelOrder(order.getId(), userId);
                    } catch (Exception e) {
                        log.error("Error cancelling order {}: {}", order.getId(), e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> cancelOrdersByType(String orderType, String userId) {
        log.info("Cancelling orders of type {} for user {}", orderType, userId);
        
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order.OrderType type = Order.OrderType.valueOf(orderType.toUpperCase());
        
        List<Order> activeOrders = orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getOrderType() == type &&
                                (order.getStatus() == Order.OrderStatus.PENDING || 
                                 order.getStatus() == Order.OrderStatus.PARTIAL_FILLED))
                .collect(Collectors.toList());
        
        return activeOrders.stream()
                .map(order -> {
                    try {
                        return spotTradingService.cancelOrder(order.getId(), userId);
                    } catch (Exception e) {
                        log.error("Error cancelling order {}: {}", order.getId(), e.getMessage());
                        return null;
                    }
                })
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> getOrdersByStatus(String status, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getStatus() == orderStatus)
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> getOrdersBySymbol(String symbol, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        TradingPair tradingPair = tradingPairService.getTradingPairEntityBySymbol(symbol)
                .orElseThrow(() -> new RuntimeException("Trading pair not found: " + symbol));
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getTradingPair().equals(tradingPair))
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> getOrdersByType(String orderType, String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Order.OrderType type = Order.OrderType.valueOf(orderType.toUpperCase());
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getOrderType() == type)
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> getPendingStopOrders(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> (order.getOrderType() == Order.OrderType.STOP_LIMIT || 
                                 order.getOrderType() == Order.OrderType.STOP_MARKET) &&
                                order.getStatus() == Order.OrderStatus.PENDING)
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SpotOrderResponse> getExpiredOrders(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.EXPIRED)
                .map(this::convertToSpotOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Scheduled(fixedRate = 10000) // Every 10 seconds
    public void processStopOrders() {
        log.debug("Processing stop orders...");
        
        // Get all pending stop orders
        List<Order> stopOrders = orderRepository.findAll()
                .stream()
                .filter(order -> (order.getOrderType() == Order.OrderType.STOP_LIMIT || 
                                 order.getOrderType() == Order.OrderType.STOP_MARKET) &&
                                order.getStatus() == Order.OrderStatus.PENDING)
                .collect(Collectors.toList());
        
        for (Order stopOrder : stopOrders) {
            try {
                processStopOrder(stopOrder);
            } catch (Exception e) {
                log.error("Error processing stop order {}: {}", stopOrder.getId(), e.getMessage());
            }
        }
    }

    @Override
    @Scheduled(fixedRate = 5000) // Every 5 seconds
    public void processTrailingStopOrders() {
        log.debug("Processing trailing stop orders...");
        
        // Get all pending trailing stop orders
        List<Order> trailingStopOrders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getOrderType() == Order.OrderType.TRAILING_STOP &&
                                order.getStatus() == Order.OrderStatus.PENDING)
                .collect(Collectors.toList());
        
        for (Order trailingStopOrder : trailingStopOrders) {
            try {
                processTrailingStopOrder(trailingStopOrder);
            } catch (Exception e) {
                log.error("Error processing trailing stop order {}: {}", trailingStopOrder.getId(), e.getMessage());
            }
        }
    }

    @Override
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void processExpiredOrders() {
        log.debug("Processing expired orders...");
        
        LocalDateTime now = LocalDateTime.now();
        
        // Get all pending GTD orders that have expired
        List<Order> expiredOrders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getOrderType() == Order.OrderType.GTD &&
                                order.getStatus() == Order.OrderStatus.PENDING &&
                                order.getExpirationTime() != null &&
                                order.getExpirationTime().isBefore(now))
                .collect(Collectors.toList());
        
        for (Order expiredOrder : expiredOrders) {
            try {
                expiredOrder.setStatus(Order.OrderStatus.EXPIRED);
                expiredOrder.setUpdatedAt(now);
                orderRepository.save(expiredOrder);
                
                // Update order book
                orderBookService.updateOrderBookOnOrderCancelled(expiredOrder);
                
                // Broadcast order update
                webSocketService.broadcastSpotOrderUpdate(expiredOrder.getUser().getUserId(), 
                        convertToSpotOrderResponse(expiredOrder));
                
                log.info("Order {} expired", expiredOrder.getId());
            } catch (Exception e) {
                log.error("Error processing expired order {}: {}", expiredOrder.getId(), e.getMessage());
            }
        }
    }

    @Override
    public OrderStatisticsResponse getOrderStatistics(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Order> userOrders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        
        // Calculate statistics
        long totalCount = userOrders.size();
        long pendingCount = userOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.PENDING)
                .count();
        long filledCount = userOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.FILLED)
                .count();
        long cancelledCount = userOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.CANCELLED)
                .count();
        long expiredCount = userOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.EXPIRED)
                .count();
        long rejectedCount = userOrders.stream()
                .filter(order -> order.getStatus() == Order.OrderStatus.REJECTED)
                .count();
        
        return new OrderStatisticsResponse(
                totalCount,
                pendingCount,
                filledCount,
                cancelledCount,
                expiredCount,
                rejectedCount
        );
    }

    // Private helper methods

    private Order createAdvancedOrder(AdvancedOrderRequest request, User user, TradingPair tradingPair) {
        Order order = new Order();
        order.setUser(user);
        order.setTradingPair(tradingPair);
        order.setOrderType(Order.OrderType.valueOf(request.getOrderType().toUpperCase()));
        order.setSide(Order.OrderSide.valueOf(request.getSide().toUpperCase()));
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        order.setStopPrice(request.getStopPrice());
        order.setTriggerPrice(request.getTriggerPrice());
        order.setTrailingStopDistance(request.getTrailingStopDistance());
        order.setExpirationTime(request.getExpirationTime());
        order.setRemainingQuantity(request.getQuantity());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        return order;
    }

    private void processIOCOrder(Order order, TradingPair tradingPair) {
        // IOC orders should be executed immediately or cancelled
        // This is a simplified implementation
        order.setStatus(Order.OrderStatus.PENDING);
        // TODO: Implement immediate execution logic
    }

    private void processFOKOrder(Order order, TradingPair tradingPair) {
        // FOK orders should be executed completely or cancelled
        // This is a simplified implementation
        order.setStatus(Order.OrderStatus.PENDING);
        // TODO: Implement fill-or-kill logic
    }

    private void processStopOrder(Order order) {
        // Check if stop price has been reached
        BigDecimal currentPrice = getCurrentPrice(order.getTradingPair());
        
        if (order.getSide() == Order.OrderSide.BUY) {
            // For buy stop orders, trigger when price goes above stop price
            if (currentPrice.compareTo(order.getStopPrice()) >= 0) {
                triggerStopOrder(order);
            }
        } else {
            // For sell stop orders, trigger when price goes below stop price
            if (currentPrice.compareTo(order.getStopPrice()) <= 0) {
                triggerStopOrder(order);
            }
        }
    }

    private void processTrailingStopOrder(Order order) {
        // Trailing stop logic - this is a simplified implementation
        // TODO: Implement proper trailing stop logic
        log.debug("Processing trailing stop order: {}", order.getId());
    }

    private void triggerStopOrder(Order order) {
        order.setStatus(Order.OrderStatus.TRIGGERED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        // Create a new market or limit order based on the stop order type
        if (order.getOrderType() == Order.OrderType.STOP_MARKET) {
            // Create market order
            // TODO: Implement market order creation
        } else if (order.getOrderType() == Order.OrderType.STOP_LIMIT) {
            // Create limit order
            // TODO: Implement limit order creation
        }
        
        log.info("Stop order {} triggered", order.getId());
    }

    private BigDecimal getCurrentPrice(TradingPair tradingPair) {
        // Get current market price - simplified implementation
        // In a real system, this would get the current market price
        return new BigDecimal("45000.00"); // Placeholder
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
} 