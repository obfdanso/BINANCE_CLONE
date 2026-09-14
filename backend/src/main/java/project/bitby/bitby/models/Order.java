package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trading_pair_id", nullable = false)
    private TradingPair tradingPair;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side;
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal price; // NULL for market orders
    
    @Column(precision = 20, scale = 8)
    private BigDecimal stopPrice; // For stop orders
    
    @Column(precision = 20, scale = 8)
    private BigDecimal triggerPrice; // For conditional orders
    
    @Column(precision = 20, scale = 8)
    private BigDecimal trailingStopDistance; // For trailing stop orders
    
    private LocalDateTime expirationTime; // For GTD orders
    
    @Column(precision = 20, scale = 8)
    private BigDecimal filledQuantity = BigDecimal.ZERO;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal remainingQuantity;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal averagePrice;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal totalFee = BigDecimal.ZERO;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime executedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (remainingQuantity == null) {
            remainingQuantity = quantity;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Order Types
    public enum OrderType {
        MARKET,      // Execute immediately at best available price
        LIMIT,       // Execute only at specified price or better
        STOP_LIMIT,  // Stop order that triggers a limit order
        STOP_MARKET, // Stop order that triggers a market order
        IOC,         // Immediate or Cancel - execute immediately or cancel remaining
        FOK,         // Fill or Kill - execute completely or cancel entirely
        GTD,         // Good Till Date - order with expiration date
        TRAILING_STOP // Trailing stop order that follows price movement
    }
    
    // Order Sides
    public enum OrderSide {
        BUY, SELL
    }
    
    // Order Status
    public enum OrderStatus {
        PENDING,           // Order is waiting to be matched
        PARTIAL_FILLED,    // Order is partially filled
        FILLED,           // Order is completely filled
        CANCELLED,        // Order was cancelled by user
        REJECTED,         // Order was rejected (invalid)
        EXPIRED,          // Order expired (for time-based orders)
        TRIGGERED,        // Stop order has been triggered
        KILLED            // Order was killed (IOC/FOK not fully filled)
    }
} 