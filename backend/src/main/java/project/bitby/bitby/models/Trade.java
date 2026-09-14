package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "trades")
@NoArgsConstructor
@AllArgsConstructor
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trading_pair_id", nullable = false)
    private TradingPair tradingPair;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maker_order_id")
    private Order makerOrder; // The order that was already in the order book
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taker_order_id")
    private Order takerOrder; // The order that triggered the trade
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maker_user_id")
    private User makerUser; // User who placed the maker order
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "taker_user_id")
    private User takerUser; // User who placed the taker order
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal price; // Price at which the trade was executed
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity; // Quantity traded
    
    @Column(precision = 20, scale = 8)
    private BigDecimal makerFee; // Fee paid by maker
    
    @Column(precision = 20, scale = 8)
    private BigDecimal takerFee; // Fee paid by taker
    
    @Column(precision = 20, scale = 8)
    private BigDecimal totalValue; // price * quantity
    
    private LocalDateTime executedAt;
    
    @PrePersist
    protected void onCreate() {
        executedAt = LocalDateTime.now();
        if (totalValue == null) {
            totalValue = price.multiply(quantity);
        }
    }
} 