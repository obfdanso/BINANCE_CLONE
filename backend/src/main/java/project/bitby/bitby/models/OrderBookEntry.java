package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "order_book_entries")
@NoArgsConstructor
@AllArgsConstructor
public class OrderBookEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trading_pair_id", nullable = false)
    private TradingPair tradingPair;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side; // BID or ASK
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal price;
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal totalQuantity;
    
    private Integer orderCount;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Order Side for order book
    public enum OrderSide {
        BID, ASK
    }
} 