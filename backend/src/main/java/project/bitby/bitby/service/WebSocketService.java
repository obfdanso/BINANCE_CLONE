package project.bitby.bitby.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import project.bitby.bitby.dto.MarketDataResponse;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.TradeResponse;
import project.bitby.bitby.models.ConvertOrder;
import project.bitby.bitby.models.Order;
import project.bitby.bitby.models.Trade;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast market data updates to all connected clients
     */
    public void broadcastMarketData(List<MarketDataResponse> marketData) {
        try {
            messagingTemplate.convertAndSend("/topic/market-data", marketData);
            log.debug("Broadcasted market data to {} cryptocurrencies", marketData.size());
        } catch (Exception e) {
            log.error("Error broadcasting market data: {}", e.getMessage());
        }
    }

    /**
     * Broadcast individual cryptocurrency update
     */
    public void broadcastCryptocurrencyUpdate(MarketDataResponse marketData) {
        try {
            messagingTemplate.convertAndSend("/topic/crypto/" + marketData.getSymbol().toLowerCase(), marketData);
            log.debug("Broadcasted update for cryptocurrency: {}", marketData.getSymbol());
        } catch (Exception e) {
            log.error("Error broadcasting cryptocurrency update for {}: {}", marketData.getSymbol(), e.getMessage());
        }
    }

    /**
     * Broadcast price alert
     */
    public void broadcastPriceAlert(String symbol, String message) {
        try {
            messagingTemplate.convertAndSend("/topic/alerts/" + symbol.toLowerCase(), message);
            log.info("Broadcasted price alert for {}: {}", symbol, message);
        } catch (Exception e) {
            log.error("Error broadcasting price alert for {}: {}", symbol, e.getMessage());
        }
    }

    /**
     * Broadcast convert order update
     */
    public void broadcastConvertOrder(ConvertOrder convertOrder) {
        try {
            // Broadcast to user-specific topic
            messagingTemplate.convertAndSend("/topic/convert/" + convertOrder.getUser().getUserId(), convertOrder);
            
            // Broadcast to general convert topic
            messagingTemplate.convertAndSend("/topic/convert", convertOrder);
            
            log.info("Broadcasted convert order update for user {}: Order ID {}", 
                    convertOrder.getUser().getUserId(), convertOrder.getId());
        } catch (Exception e) {
            log.error("Error broadcasting convert order for user {}: {}", 
                    convertOrder.getUser().getUserId(), e.getMessage());
        }
    }

    /**
     * Broadcast convert order status update
     */
    public void broadcastConvertOrderStatus(Long userId, Long orderId, ConvertOrder.ConvertStatus status) {
        try {
            String message = String.format("Order %d status updated to %s", orderId, status);
            messagingTemplate.convertAndSend("/topic/convert/" + userId, message);
            log.info("Broadcasted convert order status update: {}", message);
        } catch (Exception e) {
            log.error("Error broadcasting convert order status: {}", e.getMessage());
        }
    }

    // ========== SPOT TRADING WEBSOCKET METHODS ==========

    /**
     * Broadcast order book update for a trading pair
     */
    public void broadcastOrderBookUpdate(String symbol, OrderBookResponse orderBook) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/orderbook/" + symbol.toLowerCase(), orderBook);
            log.debug("Broadcasted order book update for trading pair: {}", symbol);
        } catch (Exception e) {
            log.error("Error broadcasting order book update for {}: {}", symbol, e.getMessage());
        }
    }

    /**
     * Broadcast spot order update to user
     */
    public void broadcastSpotOrderUpdate(String userId, SpotOrderResponse order) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/orders/" + userId, order);
            log.debug("Broadcasted spot order update for user {}: Order ID {}", userId, order.getOrderId());
        } catch (Exception e) {
            log.error("Error broadcasting spot order update for user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Broadcast trade execution
     */
    public void broadcastTradeExecution(String symbol, TradeResponse trade) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/trades/" + symbol.toLowerCase(), trade);
            log.debug("Broadcasted trade execution for trading pair: {}", symbol);
        } catch (Exception e) {
            log.error("Error broadcasting trade execution for {}: {}", symbol, e.getMessage());
        }
    }

    /**
     * Broadcast user trade update
     */
    public void broadcastUserTradeUpdate(String userId, TradeResponse trade) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/user-trades/" + userId, trade);
            log.debug("Broadcasted user trade update for user {}: Trade ID {}", userId, trade.getTradeId());
        } catch (Exception e) {
            log.error("Error broadcasting user trade update for user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Broadcast trading pair ticker update
     */
    public void broadcastTradingPairTicker(String symbol, Object tickerData) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/ticker/" + symbol.toLowerCase(), tickerData);
            log.debug("Broadcasted ticker update for trading pair: {}", symbol);
        } catch (Exception e) {
            log.error("Error broadcasting ticker update for {}: {}", symbol, e.getMessage());
        }
    }

    /**
     * Broadcast balance update to user
     */
    public void broadcastBalanceUpdate(String userId, Object balanceData) {
        try {
            messagingTemplate.convertAndSend("/topic/trading/balance/" + userId, balanceData);
            log.debug("Broadcasted balance update for user: {}", userId);
        } catch (Exception e) {
            log.error("Error broadcasting balance update for user {}: {}", userId, e.getMessage());
        }
    }
} 