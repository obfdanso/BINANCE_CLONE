package project.bitby.bitby.service;

import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.models.Order;
import project.bitby.bitby.models.TradingPair;

import java.math.BigDecimal;
import java.util.List;

public interface OrderBookService {
    
    /**
     * Update order book when an order is placed
     */
    void updateOrderBookOnOrderPlaced(Order order);
    
    /**
     * Update order book when an order is cancelled
     */
    void updateOrderBookOnOrderCancelled(Order order);
    
    /**
     * Update order book when an order is filled
     */
    void updateOrderBookOnOrderFilled(Order order);
    
    /**
     * Get order book for a trading pair
     */
    OrderBookResponse getOrderBook(TradingPair tradingPair, int depth);
    
    /**
     * Get best bid price for a trading pair
     */
    BigDecimal getBestBidPrice(TradingPair tradingPair);
    
    /**
     * Get best ask price for a trading pair
     */
    BigDecimal getBestAskPrice(TradingPair tradingPair);
    
    /**
     * Get spread for a trading pair
     */
    BigDecimal getSpread(TradingPair tradingPair);
    
    /**
     * Rebuild order book from active orders
     */
    void rebuildOrderBook(TradingPair tradingPair);
} 