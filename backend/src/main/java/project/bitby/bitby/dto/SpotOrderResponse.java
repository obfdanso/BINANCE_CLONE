package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpotOrderResponse {
    private Long orderId;
    private String symbol;
    private String orderType;
    private String side;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal stopPrice;
    private BigDecimal filledQuantity;
    private BigDecimal remainingQuantity;
    private BigDecimal averagePrice;
    private String status;
    private BigDecimal totalFee;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime executedAt;
} 