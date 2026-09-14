package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradeResponse {
    private Long tradeId;
    private String symbol;
    private Long orderId;
    private BigDecimal price;
    private BigDecimal quantity;
    private BigDecimal totalValue;
    private BigDecimal fee;
    private String side; // BUY or SELL (from user's perspective)
    private LocalDateTime executedAt;
} 