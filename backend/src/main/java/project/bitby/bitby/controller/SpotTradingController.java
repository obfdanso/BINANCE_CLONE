package project.bitby.bitby.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.SpotOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderBookResponse;
import project.bitby.bitby.dto.TradeResponse;
import project.bitby.bitby.security.UserDetailsImpl;
import project.bitby.bitby.service.SpotTradingService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trading")
@RequiredArgsConstructor
@Tag(name = "Spot Trading", description = "Spot trading management APIs")
@CrossOrigin(origins = "*")
public class SpotTradingController {

    private final SpotTradingService spotTradingService;

    @PostMapping("/orders")
    @Operation(summary = "Place a new order", description = "Place a new spot trading order")
    public ResponseEntity<SpotOrderResponse> placeOrder(
            @RequestBody SpotOrderRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        SpotOrderResponse response = spotTradingService.placeOrder(request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "Cancel an order", description = "Cancel an existing spot trading order")
    public ResponseEntity<SpotOrderResponse> cancelOrder(
            @Parameter(description = "Order ID to cancel") 
            @PathVariable Long orderId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        SpotOrderResponse response = spotTradingService.cancelOrder(orderId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    @Operation(summary = "Get user orders", description = "Get all orders for the authenticated user")
    public ResponseEntity<List<SpotOrderResponse>> getUserOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = spotTradingService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Get specific order", description = "Get details of a specific order")
    public ResponseEntity<SpotOrderResponse> getOrderById(
            @Parameter(description = "Order ID") 
            @PathVariable Long orderId,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        SpotOrderResponse order = spotTradingService.getOrderById(orderId, userId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/orderbook/{symbol}")
    @Operation(summary = "Get order book", description = "Get order book for a trading pair")
    public ResponseEntity<OrderBookResponse> getOrderBook(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT)") 
            @PathVariable String symbol,
            @Parameter(description = "Order book depth (default: 20)") 
            @RequestParam(defaultValue = "20") int depth) {
        OrderBookResponse orderBook = spotTradingService.getOrderBook(symbol, depth);
        return ResponseEntity.ok(orderBook);
    }

    @GetMapping("/trades")
    @Operation(summary = "Get user trades", description = "Get trade history for the authenticated user")
    public ResponseEntity<List<TradeResponse>> getUserTrades(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<TradeResponse> trades = spotTradingService.getUserTrades(userId);
        return ResponseEntity.ok(trades);
    }

    @GetMapping("/trades/{symbol}")
    @Operation(summary = "Get recent trades", description = "Get recent trades for a trading pair")
    public ResponseEntity<List<TradeResponse>> getRecentTrades(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT)") 
            @PathVariable String symbol,
            @Parameter(description = "Number of recent trades to return (default: 50)") 
            @RequestParam(defaultValue = "50") int limit) {
        List<TradeResponse> trades = spotTradingService.getRecentTrades(symbol, limit);
        return ResponseEntity.ok(trades);
    }
} 