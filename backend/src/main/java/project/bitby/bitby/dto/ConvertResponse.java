package project.bitby.bitby.dto;

import lombok.Data;
import project.bitby.bitby.models.ConvertOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ConvertResponse {

    private Long orderId;
    private String fromSymbol;
    private String toSymbol;
    private BigDecimal fromAmount;
    private BigDecimal toAmount;
    private BigDecimal exchangeRate;
    private ConvertOrder.ConvertType convertType;
    private ConvertOrder.ConvertStatus status;
    private BigDecimal targetPrice;
    private ConvertOrder.RecurringInterval recurringInterval;
    private LocalDateTime nextExecutionTime;
    private LocalDateTime lastExecutionTime;
    private Integer totalExecutions;
    private Integer maxExecutions;
    private LocalDateTime createdAt;
    private LocalDateTime executedAt;
    private LocalDateTime expiresAt;
    private String message;
    private boolean success;
} 