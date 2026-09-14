package project.bitby.bitby.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ConvertQuoteResponse {

    private String fromSymbol;
    private String toSymbol;
    private BigDecimal fromAmount;
    private BigDecimal toAmount;
    private BigDecimal exchangeRate;
    private BigDecimal fee;
    private BigDecimal feePercentage;
    private LocalDateTime quoteTime;
    private LocalDateTime expiresAt;
    private String message;
    private boolean success;
} 