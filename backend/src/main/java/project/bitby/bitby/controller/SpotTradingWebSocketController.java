package project.bitby.bitby.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.TradeResponse;
import project.bitby.bitby.service.OrderBookService;
import project.bitby.bitby.service.SpotTradingService;
import project.bitby.bitby.service.TradingPairService;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
public class SpotTradingWebSocketController {

    private final SpotTradingService spotTradingService;
    private final TradingPairService tradingPairService;
    private final OrderBookService orderBookService;

    /**
     * Subscribe to order book updates for a specific trading pair
     */
    @MessageMapping("/trading/subscribe-orderbook")
    @SendTo("/topic/trading/orderbook/{symbol}")
    public OrderBookResponse subscribeToOrderBook(String symbol, Principal principal) {
        log.info("User {} subscribed to order book for {}", principal.getName(), symbol);
        
        try {
            var tradingPair = tradingPairService.getTradingPairEntityBySymbol(symbol);
            if (tradingPair.isPresent()) {
                return orderBookService.getOrderBook(tradingPair.get(), 20);
            }
        } catch (Exception e) {
            log.error("Error getting order book for {}: {}", symbol, e.getMessage());
        }
        
        return new OrderBookResponse(symbol, System.currentTimeMillis(), null, null);
    }

    /**
     * Subscribe to user's order updates
     */
    @MessageMapping("/trading/subscribe-orders")
    @SendTo("/topic/trading/orders/{userId}")
    public String subscribeToOrders(Principal principal) {
        log.info("User {} subscribed to order updates", principal.getName());
        return "Subscribed to order updates";
    }

    /**
     * Subscribe to trade updates for a specific trading pair
     */
    @MessageMapping("/trading/subscribe-trades")
    @SendTo("/topic/trading/trades/{symbol}")
    public String subscribeToTrades(String symbol, Principal principal) {
        log.info("User {} subscribed to trades for {}", principal.getName(), symbol);
        return "Subscribed to trade updates for " + symbol;
    }

    /**
     * Subscribe to user's trade updates
     */
    @MessageMapping("/trading/subscribe-user-trades")
    @SendTo("/topic/trading/user-trades/{userId}")
    public String subscribeToUserTrades(Principal principal) {
        log.info("User {} subscribed to user trade updates", principal.getName());
        return "Subscribed to user trade updates";
    }

    /**
     * Subscribe to trading pair ticker updates
     */
    @MessageMapping("/trading/subscribe-ticker")
    @SendTo("/topic/trading/ticker/{symbol}")
    public String subscribeToTicker(String symbol, Principal principal) {
        log.info("User {} subscribed to ticker for {}", principal.getName(), symbol);
        return "Subscribed to ticker updates for " + symbol;
    }

    /**
     * Subscribe to balance updates
     */
    @MessageMapping("/trading/subscribe-balance")
    @SendTo("/topic/trading/balance/{userId}")
    public String subscribeToBalance(Principal principal) {
        log.info("User {} subscribed to balance updates", principal.getName());
        return "Subscribed to balance updates";
    }

    /**
     * Handle WebSocket connection
     */
    @MessageMapping("/trading/connect")
    @SendTo("/topic/trading/connection")
    public String handleConnection(SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        log.info("User {} connected to spot trading WebSocket", principal.getName());
        return "Connected to spot trading WebSocket";
    }

    /**
     * Handle WebSocket disconnection
     */
    @MessageMapping("/trading/disconnect")
    @SendTo("/topic/trading/disconnection")
    public String handleDisconnection(SimpMessageHeaderAccessor headerAccessor, Principal principal) {
        log.info("User {} disconnected from spot trading WebSocket", principal.getName());
        return "Disconnected from spot trading WebSocket";
    }
} 