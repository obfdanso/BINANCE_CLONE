package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "price_alerts")
@NoArgsConstructor
@AllArgsConstructor
public class PriceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;
    
    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal targetPrice;
    
    @Enumerated(EnumType.STRING)
    private AlertType alertType;
    
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime triggeredAt;
    
    public enum AlertType {
        ABOVE, BELOW
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 