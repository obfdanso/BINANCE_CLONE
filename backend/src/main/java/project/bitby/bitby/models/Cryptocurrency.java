package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cryptocurrencies")
@NoArgsConstructor
@AllArgsConstructor
public class Cryptocurrency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String symbol;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal currentPrice;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal priceChange24h;
    
    @Column(precision = 10, scale = 4)
    private BigDecimal priceChangePercentage24h;
    
    @Column(precision = 30, scale = 8)
    private BigDecimal marketCap;
    
    @Column(precision = 30, scale = 8)
    private BigDecimal volume24h;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal high24h;
    
    @Column(precision = 20, scale = 8)
    private BigDecimal low24h;
    
    private String imageUrl;
    
    private Boolean isActive = true;
    
    private LocalDateTime lastUpdated;
    
    @Column(unique = true)
    private String coinGeckoId;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}