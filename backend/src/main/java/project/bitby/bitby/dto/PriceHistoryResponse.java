package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import project.bitby.bitby.models.PriceHistory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceHistoryResponse {
    private String symbol;
    private BigDecimal price;
    private BigDecimal volume;
    private LocalDateTime timestamp;
    private PriceHistory.TimeInterval interval;
} 