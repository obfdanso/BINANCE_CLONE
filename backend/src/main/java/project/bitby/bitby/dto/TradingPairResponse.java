package project.bitby.bitby.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TradingPairResponse {
    private Long id;
    private String baseAsset;
    private String quoteAsset;
    private String symbol;
    private BigDecimal minOrderSize;
    private BigDecimal maxOrderSize;
    private Integer pricePrecision;
    private Integer quantityPrecision;
    private BigDecimal tradingFee;
    private BigDecimal makerFee;
    private BigDecimal takerFee;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;
    
    // Additional market data
    private BigDecimal lastPrice;
    private BigDecimal priceChange24h;
    private BigDecimal priceChangePercentage24h;
    private BigDecimal volume24h;
    private BigDecimal high24h;
    private BigDecimal low24h;
} 