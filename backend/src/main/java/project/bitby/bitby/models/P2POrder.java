package project.bitby.bitby.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "p2p_orders")
@NoArgsConstructor
@AllArgsConstructor
public class P2POrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "listing_id", nullable = false)
    private P2PListing listing;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(nullable = false)
    private String userId;

    @ManyToOne
    @JoinColumn(name = "cryptocurrency_id", nullable = false)
    private Cryptocurrency cryptocurrency;

    @Column(nullable = false)
    private String assetSymbol;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(nullable = false)
    private Double pricePerUnit;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime paymentConfirmedAt;

    @Column
    private LocalDateTime assetsReleasedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum OrderType {
        BUY, SELL
    }

    public enum OrderStatus {
        PENDING,    // Order created, waiting for payment confirmation
        PAID,       // Payment confirmed
        RELEASED,   // Assets released, transaction completed
        CANCELLED   // Order cancelled
    }
} 