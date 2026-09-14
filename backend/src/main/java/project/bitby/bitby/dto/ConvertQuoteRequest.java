package project.bitby.bitby.dto;

import lombok.Data;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class ConvertQuoteRequest {

    @NotBlank(message = "From cryptocurrency symbol is required")
    private String fromSymbol;

    @NotBlank(message = "To cryptocurrency symbol is required")
    private String toSymbol;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.00000001", message = "Amount must be greater than 0")
    private BigDecimal amount;
} 