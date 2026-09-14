package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpotOrderRequest {
    private String symbol; // Trading pair symbol (e.g., BTCUSDT)
    private String orderType; // MARKET, LIMIT, STOP_LIMIT, STOP_MARKET
    private String side; // BUY, SELL
    private BigDecimal quantity;
    private BigDecimal price; // Required for LIMIT orders, optional for MARKET
    private BigDecimal stopPrice; // Required for STOP orders
    private String timeInForce = "GTC"; // GTC (Good Till Cancelled), IOC (Immediate or Cancel), FOK (Fill or Kill)
} 