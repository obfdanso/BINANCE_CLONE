package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "price_history")
@NoArgsConstructor
@AllArgsConstructor
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal price;
    
    @Column(precision = 30, scale = 8)
    private BigDecimal volume;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    private TimeInterval interval = TimeInterval.HOURLY;
    
    public enum TimeInterval {
        MINUTE_1, MINUTE_5, MINUTE_15, MINUTE_30, HOURLY, DAILY
    }
} 