package project.bitby.bitby.service;

import project.bitby.bitby.dto.AdvancedOrderRequest;
import project.bitby.bitby.dto.OrderModificationRequest;
import project.bitby.bitby.dto.BulkOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderStatisticsResponse;

import java.util.List;

public interface AdvancedOrderService {
    
    /**
     * Place an advanced order (supports all order types)
     */
    SpotOrderResponse placeAdvancedOrder(AdvancedOrderRequest request, String userId);
    
    /**
     * Modify an existing order
     */
    SpotOrderResponse modifyOrder(OrderModificationRequest request, String userId);
    
    /**
     * Place multiple orders in a batch
     */
    List<SpotOrderResponse> placeBulkOrders(BulkOrderRequest request, String userId);
    
    /**
     * Cancel all orders for a user
     */
    List<SpotOrderResponse> cancelAllOrders(String userId);
    
    /**
     * Cancel all orders for a specific trading pair
     */
    List<SpotOrderResponse> cancelOrdersBySymbol(String symbol, String userId);
    
    /**
     * Cancel orders by order type
     */
    List<SpotOrderResponse> cancelOrdersByType(String orderType, String userId);
    
    /**
     * Get orders by status
     */
    List<SpotOrderResponse> getOrdersByStatus(String status, String userId);
    
    /**
     * Get orders by trading pair
     */
    List<SpotOrderResponse> getOrdersBySymbol(String symbol, String userId);
    
    /**
     * Get orders by order type
     */
    List<SpotOrderResponse> getOrdersByType(String orderType, String userId);
    
    /**
     * Get pending stop orders
     */
    List<SpotOrderResponse> getPendingStopOrders(String userId);
    
    /**
     * Get expired orders
     */
    List<SpotOrderResponse> getExpiredOrders(String userId);
    
    /**
     * Process stop orders (check if they should be triggered)
     */
    void processStopOrders();
    
    /**
     * Process trailing stop orders
     */
    void processTrailingStopOrders();
    
    /**
     * Process expired orders
     */
    void processExpiredOrders();
    
    /**
     * Get order statistics for a user
     */
    OrderStatisticsResponse getOrderStatistics(String userId);
} 