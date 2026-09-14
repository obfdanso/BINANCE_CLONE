package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.bitby.bitby.models.P2POrder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long listingId;
    private String userId;
    private String buyerUsername;
    private String sellerUsername;
    private String assetSymbol;
    private Double amount;
    private Double totalPrice;
    private Double pricePerUnit;
    private String currency;
    private String paymentMethod;
    private P2POrder.OrderType orderType;
    private P2POrder.OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime paymentConfirmedAt;
    private LocalDateTime assetsReleasedAt;
} 