package project.bitby.bitby.dto;

import lombok.Data;
import project.bitby.bitby.models.ConvertOrder;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ConvertRequest {

    @NotBlank(message = "From cryptocurrency symbol is required")
    private String fromSymbol;

    @NotBlank(message = "To cryptocurrency symbol is required")
    private String toSymbol;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.00000001", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Convert type is required")
    private ConvertOrder.ConvertType convertType;

    // For Limit Convert
    @DecimalMin(value = "0.00000001", message = "Target price must be greater than 0")
    private BigDecimal targetPrice;

    // For Recurring Convert
    private ConvertOrder.RecurringInterval recurringInterval;
    private Integer maxExecutions;
    private LocalDateTime startTime;

    // For both Limit and Recurring
    private LocalDateTime expiresAt;

    // Validation method
    public boolean isValid() {
        switch (convertType) {
            case INSTANT:
                return fromSymbol != null && toSymbol != null && amount != null;
            case LIMIT:
                return fromSymbol != null && toSymbol != null && amount != null && targetPrice != null;
            case RECURRING:
                return fromSymbol != null && toSymbol != null && amount != null && 
                       recurringInterval != null && startTime != null;
            default:
                return false;
        }
    }
} 