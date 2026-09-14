package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "convert_orders")
@NoArgsConstructor
@AllArgsConstructor
public class ConvertOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_cryptocurrency_id", nullable = false)
    private Cryptocurrency fromCrypto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_cryptocurrency_id", nullable = false)
    private Cryptocurrency toCrypto;

    @Column(precision = 20, scale = 8, nullable = false)
    private BigDecimal fromAmount;

    @Column(precision = 20, scale = 8)
    private BigDecimal toAmount;

    @Column(precision = 20, scale = 8)
    private BigDecimal exchangeRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConvertType convertType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConvertStatus status;

    // For Limit Convert
    @Column(precision = 20, scale = 8)
    private BigDecimal targetPrice;

    // For Recurring Convert
    @Enumerated(EnumType.STRING)
    private RecurringInterval recurringInterval;

    private LocalDateTime nextExecutionTime;

    private LocalDateTime lastExecutionTime;

    private Integer totalExecutions;

    private Integer maxExecutions;

    private LocalDateTime createdAt;

    private LocalDateTime executedAt;

    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = ConvertStatus.PENDING;
        }
        if (totalExecutions == null) {
            totalExecutions = 0;
        }
    }

    public enum ConvertType {
        INSTANT,    // Immediate conversion at current market price
        RECURRING,  // Scheduled conversions at regular intervals
        LIMIT       // Conversion at a specific target price
    }

    public enum ConvertStatus {
        PENDING,    // Order is waiting to be executed
        EXECUTED,   // Order has been successfully executed
        CANCELLED,  // Order has been cancelled
        EXPIRED,    // Order has expired
        FAILED      // Order failed to execute
    }

    public enum RecurringInterval {
        DAILY,      // Execute daily
        WEEKLY,     // Execute weekly
        MONTHLY     // Execute monthly
    }
} 