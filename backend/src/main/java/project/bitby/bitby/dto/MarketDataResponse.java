package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketDataResponse {
    private String symbol;
    private String name;
    private BigDecimal currentPrice;
    private BigDecimal priceChange24h;
    private BigDecimal priceChangePercentage24h;
    private BigDecimal marketCap;
    private BigDecimal volume24h;
    private BigDecimal high24h;
    private BigDecimal low24h;
    private String imageUrl;
    private LocalDateTime lastUpdated;
} 