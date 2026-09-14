package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "trading_pairs")
@NoArgsConstructor
@AllArgsConstructor
public class TradingPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String baseAsset; // e.g., BTC, ETH
    
    @Column(nullable = false)
    private String quoteAsset; // e.g., USDT, GHS
    
    @Column(unique = true, nullable = false)
    private String symbol; // e.g., BTCUSDT, ETHGHS
    
    @Column(precision = 20, scale = 8)
    private BigDecimal minOrderSize;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal maxOrderSize;
    
    private Integer pricePrecision = 2;
    
    private Integer quantityPrecision = 6;
    
    @Column(precision = 5, scale = 4)
    private BigDecimal tradingFee = new BigDecimal("0.001"); // 0.1% default
    
    @Column(precision = 5, scale = 4)
    private BigDecimal makerFee = new BigDecimal("0.0005"); // 0.05% for makers
    
    @Column(precision = 5, scale = 4)
    private BigDecimal takerFee = new BigDecimal("0.001"); // 0.1% for takers
    
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
} 