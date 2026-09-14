package project.bitby.bitby.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvancedOrderRequest {
    
    // Basic order information
    private String symbol; // Trading pair symbol (e.g., BTCUSDT)
    private String orderType; // MARKET, LIMIT, STOP_LIMIT, STOP_MARKET, IOC, FOK, GTD, TRAILING_STOP
    private String side; // BUY, SELL
    private BigDecimal quantity;
    private BigDecimal price; // Required for LIMIT, STOP_LIMIT, GTD orders
    
    // Stop order parameters
    private BigDecimal stopPrice; // Required for STOP_LIMIT, STOP_MARKET orders
    private BigDecimal triggerPrice; // For conditional orders
    
    // Trailing stop parameters
    private BigDecimal trailingStopDistance; // For TRAILING_STOP orders
    
    // Time-based parameters
    private LocalDateTime expirationTime; // For GTD orders
    
    // Time in force
    private String timeInForce = "GTC"; // GTC, IOC, FOK, GTD
    
    // Advanced parameters
    private Boolean reduceOnly = false; // Only reduce position, don't increase
    private Boolean postOnly = false; // Only post as maker, don't take liquidity
    private String clientOrderId; // Client-generated order ID for tracking
    
    // OCO (One-Cancels-Other) parameters
    private BigDecimal ocoPrice; // Price for the other leg of OCO
    private BigDecimal ocoStopPrice; // Stop price for the other leg of OCO
    private String ocoStopLimitPrice; // Stop limit price for the other leg of OCO
    private String ocoStopLimitTimeInForce; // Time in force for stop limit order
    
    // Validation method
    public boolean isValid() {
        if (symbol == null || symbol.trim().isEmpty()) return false;
        if (orderType == null || side == null) return false;
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) return false;
        
        // Validate based on order type
        switch (orderType.toUpperCase()) {
            case "LIMIT":
            case "GTD":
                return price != null && price.compareTo(BigDecimal.ZERO) > 0;
            case "STOP_LIMIT":
                return price != null && stopPrice != null && 
                       price.compareTo(BigDecimal.ZERO) > 0 && 
                       stopPrice.compareTo(BigDecimal.ZERO) > 0;
            case "STOP_MARKET":
                return stopPrice != null && stopPrice.compareTo(BigDecimal.ZERO) > 0;
            case "TRAILING_STOP":
                return trailingStopDistance != null && trailingStopDistance.compareTo(BigDecimal.ZERO) > 0;
            case "MARKET":
            case "IOC":
            case "FOK":
                return true; // No additional validation needed
            default:
                return false;
        }
    }
} 