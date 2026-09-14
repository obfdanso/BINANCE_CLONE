package project.bitby.bitby.service;

import project.bitby.bitby.dto.SpotOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.dto.TradeResponse;

import java.util.List;

public interface SpotTradingService {
    
    /**
     * Place a new spot trading order
     */
    SpotOrderResponse placeOrder(SpotOrderRequest request, String userId);
    
    /**
     * Cancel an existing order
     */
    SpotOrderResponse cancelOrder(Long orderId, String userId);
    
    /**
     * Get user's orders
     */
    List<SpotOrderResponse> getUserOrders(String userId);
    
    /**
     * Get specific order by ID
     */
    SpotOrderResponse getOrderById(Long orderId, String userId);
    
    /**
     * Get order book for a trading pair
     */
    OrderBookResponse getOrderBook(String symbol, int depth);
    
    /**
     * Get user's trade history
     */
    List<TradeResponse> getUserTrades(String userId);
    
    /**
     * Get recent trades for a trading pair
     */
    List<TradeResponse> getRecentTrades(String symbol, int limit);
} 