package project.bitby.bitby.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import project.bitby.bitby.dto.AdvancedOrderRequest;
import project.bitby.bitby.dto.OrderModificationRequest;
import project.bitby.bitby.dto.BulkOrderRequest;
import project.bitby.bitby.dto.SpotOrderResponse;
import project.bitby.bitby.dto.OrderStatisticsResponse;
import project.bitby.bitby.security.UserDetailsImpl;
import project.bitby.bitby.service.AdvancedOrderService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trading/advanced")
@RequiredArgsConstructor
@Tag(name = "Advanced Trading", description = "Advanced order types and trading features")
@CrossOrigin(origins = "*")
public class AdvancedOrderController {

    private final AdvancedOrderService advancedOrderService;

    @PostMapping("/orders")
    @Operation(summary = "Place advanced order", description = "Place an advanced order with support for all order types")
    public ResponseEntity<SpotOrderResponse> placeAdvancedOrder(
            @RequestBody AdvancedOrderRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        SpotOrderResponse response = advancedOrderService.placeAdvancedOrder(request, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/orders/modify")
    @Operation(summary = "Modify order", description = "Modify an existing order")
    public ResponseEntity<SpotOrderResponse> modifyOrder(
            @RequestBody OrderModificationRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        SpotOrderResponse response = advancedOrderService.modifyOrder(request, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/orders/bulk")
    @Operation(summary = "Place bulk orders", description = "Place multiple orders in a batch")
    public ResponseEntity<List<SpotOrderResponse>> placeBulkOrders(
            @RequestBody BulkOrderRequest request,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> responses = advancedOrderService.placeBulkOrders(request, userId);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/orders/all")
    @Operation(summary = "Cancel all orders", description = "Cancel all orders for the authenticated user")
    public ResponseEntity<List<SpotOrderResponse>> cancelAllOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> responses = advancedOrderService.cancelAllOrders(userId);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/orders/symbol/{symbol}")
    @Operation(summary = "Cancel orders by symbol", description = "Cancel all orders for a specific trading pair")
    public ResponseEntity<List<SpotOrderResponse>> cancelOrdersBySymbol(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT)") 
            @PathVariable String symbol,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> responses = advancedOrderService.cancelOrdersBySymbol(symbol, userId);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/orders/type/{orderType}")
    @Operation(summary = "Cancel orders by type", description = "Cancel all orders of a specific type")
    public ResponseEntity<List<SpotOrderResponse>> cancelOrdersByType(
            @Parameter(description = "Order type (e.g., LIMIT, STOP_LIMIT, MARKET)") 
            @PathVariable String orderType,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> responses = advancedOrderService.cancelOrdersByType(orderType, userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/orders/status/{status}")
    @Operation(summary = "Get orders by status", description = "Get all orders with a specific status")
    public ResponseEntity<List<SpotOrderResponse>> getOrdersByStatus(
            @Parameter(description = "Order status (e.g., PENDING, FILLED, CANCELLED)") 
            @PathVariable String status,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = advancedOrderService.getOrdersByStatus(status, userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/symbol/{symbol}")
    @Operation(summary = "Get orders by symbol", description = "Get all orders for a specific trading pair")
    public ResponseEntity<List<SpotOrderResponse>> getOrdersBySymbol(
            @Parameter(description = "Trading pair symbol (e.g., BTCUSDT)") 
            @PathVariable String symbol,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = advancedOrderService.getOrdersBySymbol(symbol, userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/type/{orderType}")
    @Operation(summary = "Get orders by type", description = "Get all orders of a specific type")
    public ResponseEntity<List<SpotOrderResponse>> getOrdersByType(
            @Parameter(description = "Order type (e.g., LIMIT, STOP_LIMIT, MARKET)") 
            @PathVariable String orderType,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = advancedOrderService.getOrdersByType(orderType, userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/stop-orders")
    @Operation(summary = "Get pending stop orders", description = "Get all pending stop orders")
    public ResponseEntity<List<SpotOrderResponse>> getPendingStopOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = advancedOrderService.getPendingStopOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/expired")
    @Operation(summary = "Get expired orders", description = "Get all expired orders")
    public ResponseEntity<List<SpotOrderResponse>> getExpiredOrders(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        List<SpotOrderResponse> orders = advancedOrderService.getExpiredOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get order statistics", description = "Get order statistics for the authenticated user")
    public ResponseEntity<OrderStatisticsResponse> getOrderStatistics(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        OrderStatisticsResponse statistics = advancedOrderService.getOrderStatistics(userId);
        return ResponseEntity.ok(statistics);
    }
} 